import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from "stripe";

// create a new stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// function to place order for frontend
export const placeOrder = async (req, res) => {
  try {
    // create a new order instance
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // save the newly created order to the database
    await newOrder.save();
    // update user's info
    await User.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // get order's items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "EUR",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // push charges for delivery
    line_items.push({
      price_data: {
        currency: "EUR",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200,
      },
      quantity: 1,
    });

    // create a new stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    // return the success response with the session url object
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function to verify a placed order
export const verifyOrder = async (req, res) => {
  try {
    // extract order's id and payment's status from req.body
    const { orderId, success } = req.body;

    // check payment's status
    if (success == "true") {
      // find the specific order by id & update it's order's status
      await Order.findByIdAndUpdate(orderId, { payment: true });
      // return success response
      res.json({
        success: true,
        message: "Order's Payment Confirmed Successfully!",
      });
    } else {
      // delete the order from the database
      await Order.findByIdAndDelete(orderId);
      // return fail response
      res.json({
        success: false,
        message: "Order's Payment Failed! Please, Try Again!",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get user's orders for frontend display
export const userOrders = async (req, res) => {
  try {
    // find all orders from the user with the id we have taken from authMiddleware
    const orders = await Order.find({ userId: req.body.userId });
    // send the retrieved orders to the response
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function to fetch all orders from all users for admin panel
export const listOrders = async (req, res) => {
  try {
    // retrieve all orders from the database
    const orders = await Order.find({});
    // provide the retrieved orders to the response (SOS: without checking further the length of orders (edge case: 0) or if they do not exist)
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function to update order's status
export const updateStatus = async (req, res) => {
  try {
    // find the order by id & update it's status
    await Order.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    // return success response
    res.json({
      success: true,
      message: "Order's Status Updated Successfully!",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

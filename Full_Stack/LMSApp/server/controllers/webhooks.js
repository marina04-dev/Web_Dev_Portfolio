import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// API function to manage clerk user with the database
export const clerkWebHooks = async (req, res) => {
  try {
    // create new web hook
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // verify the web hook
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // get the payload of the request
    const { data, type } = req.body;

    // act different according to the action/type
    switch (type) {
      // user creation case
      case "user.created": {
        // create the user from the payload's data
        const userData = {
          _id: data.id,
          name: data.first_name + " " + data.last_name,
          email: data.email_address[0].email_address,
          imageUrl: data.image_url,
        };

        // save the newly created user to the database
        await User.create(userData);

        // send the response empty object
        res.json({});
        break;
      }
      // user update case
      case "user.updated": {
        // get the updated user from the payload's data
        const userData = {
          name: data.first_name + " " + data.last_name,
          email: data.email_addresses[0].email_address,
          imageUrl: data.image_url,
        };

        // save the updated user to the database
        await User.findByIdAndUpdate(data.id, userData);

        // send the response empty object
        res.json({});
        break;
      }
      // user delete case
      case "user.deleted": {
        // delete the user from the database
        await User.findByIdAndDelete(data.id);

        // send the response empty object
        res.json({});
        break;
      }
      default: {
        break;
      }
    }
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// create a new stripe instance
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// API to configure stripe web hooks payment
export const stripeWebHooks = async (req, res) => {
  // extract stripe signature from req.headers
  const sig = req.headers["stripe-signature"];

  // declare event variable
  let event;
  try {
    // create a stripe webhook event with req.body
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }

  // Handle the event
  switch (event.type) {
    // case payment succeeded
    case "payment_intent.succeeded": {
      // get payment intent from the event
      const paymentIntent = event.data.object;

      // get payment intent id
      const paymentIntentId = paymentIntent.id;

      // create a stripe session
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      // extract purchaseId from session
      const { purchaseId } = session.data[0].metadata;

      // get purchase, user & course data
      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );

      // push userData to courseData enrolledStudents
      courseData.enrolledStudents.push(userData);
      // save the updated data in the database
      await courseData.save();

      // push courseData._id to courseData enrolledCourses
      userData.enrolledCourses.push(courseData._id);
      // save the updated data in the database
      await userData.save();

      // change purchase data from default 'Pending' to 'Completed'
      purchaseData.status = "Completed";
      // save the updated data in the database
      await purchaseData.save();
      break;
    }

    // failed payment case
    case "payment_intent.payment_failed": {
      // get payment intent from the event
      const paymentIntent = event.data.object;

      // get payment intent id
      const paymentIntentId = paymentIntent.id;

      // create a stripe session
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      // extract purchaseId from session
      const { purchaseId } = session.data[0].metadata;

      // get purchase data
      const purchaseData = await Purchase.findById(purchaseId);

      // change purchase data from default 'Pending' to 'Failed'
      purchaseData.status = "Failed";
      // save the updated data in the database
      await purchaseData.save();
      break;
    }

    default:
      console.log(`Unhandled Event Type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};

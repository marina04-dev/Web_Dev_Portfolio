import User from "../models/User.js";

// function to add items to user's cart
export const addToCart = async (req, res) => {
  try {
    // find user's data from id we got from authMiddleware
    let userData = await User.findById(req.body.userId);
    // get user's cartData from userData
    let cartData = await userData.cartData;

    // check if the item the user tries to add to his/her cart already exists in it in order to append else initialize with quantity 1
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    // update user's data
    await User.findByIdAndUpdate(req.body.userId, { cartData });

    // return success response
    res.json({ success: true, message: "Item Added To Cart Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function to remove items from user's cart
export const removeFromCart = async (req, res) => {
  try {
    // find user's data from id we got from authMiddleware
    let userData = await User.findById(req.body.userId);
    // get user's cartData from userData
    let cartData = await userData.cartData;

    // check if the item the user tries to remove from his/her cart already is in it
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    // update user's data
    await User.findByIdAndUpdate(req.body.userId, { cartData });

    // return success response
    res.json({
      success: true,
      message: "Item Removed From Cart Successfully!",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function to fetch all items from user's cart
export const getCart = async (req, res) => {
  try {
    // find user's data from id we got from authMiddleware
    let userData = await User.findById(req.body.userId);
    // get user's cartData from userData
    let cartData = await userData.cartData;

    // return success response with the retrieved data
    res.json({
      success: true,
      cartData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

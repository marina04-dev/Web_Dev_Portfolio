import User from "../models/User.js";

// get user's data controller
export const getUserData = async (req, res) => {
  try {
    // get userId from req.body
    const { userId } = req.body;

    // find the user
    const user = await User.findById(userId);

    // check if user exists
    if (!user) {
      return res.json({ success: false, message: "User Does Not Exist!" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

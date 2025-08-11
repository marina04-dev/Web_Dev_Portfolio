import { clerkClient } from "@clerk/express";

// protect educator routes middleware
export const protectEducator = async (req, res, next) => {
  try {
    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // get the user with this id
    const response = await clerkClient.users.getUser(userId);

    // check user's role (it must be educator)
    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Unauthorized Access!" });
    }

    // call the next middleware
    next();
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

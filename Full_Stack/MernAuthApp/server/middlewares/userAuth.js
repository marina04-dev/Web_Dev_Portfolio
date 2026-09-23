import jwt from "jsonwebtoken";

// extract the userId and the otp from the provided token
// and insert it in the req.body in order to be able to user it like we do in the controllers folder
const userAuth = async (req, res, next) => {
  // extract the token from req.cookies
  const { token } = req.cookies;

  // check if token exists
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized! Please Try To Login Again!",
    });
  }

  try {
    // decode the token from the cookie
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // find the user's Id from the token because we have generated the token using the user's Id
    if (decodedToken.id) {
      // add the userId to the request body so we can extract it after in the next middlewares from the controllers folder
      req.body.userId = decodedToken.id;
    } else {
      // if user's id is not available
      return res.json({
        success: false,
        message: "Not Authorized! Please Try To Login Again!",
      });
    }

    // call the next middleware (controllers folder)
    next();
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;

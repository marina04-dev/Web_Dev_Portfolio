import jwt from "jsonwebtoken";

// function to authorize & authenticate the user
export const authMiddleware = async (req, res, next) => {
  try {
    // get user's token from request's headers
    const { token } = req.headers;

    // check if token is not available
    if (!token) {
      return res.json({ success: false, message: "Not Authorized!" });
    }

    // decode the token to verify it
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // extract user's id from decoded token & attach it to req.body object as userId property
    req.body.userId = token_decode.id;
    // call the next middleware
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

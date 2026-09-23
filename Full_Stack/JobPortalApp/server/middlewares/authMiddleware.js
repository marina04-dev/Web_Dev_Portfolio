import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

// function to decode the token that we will get from headers
export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;

  // check if token exists
  if (!token) {
    return res.json({ success: false, message: "Not Authorized!" });
  }

  try {
    // try to decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach company data to req.company
    req.company = await Company.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

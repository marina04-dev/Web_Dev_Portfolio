import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import "dotenv/config.js";

// function to create token
export const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// function to handle login user
export const loginUser = async (req, res) => {
  try {
    // extract user's data from request's body
    const { email, password } = req.body;

    // find if the user exists in the database
    const user = await User.findOne({ email });

    // make the check
    if (!user) {
      return res.json({ success: false, message: "User Does Not Exist!" });
    }

    // check if the password provided is equal to the password that the user with this email has in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // make the check
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials!" });
    }

    // generate user's token
    const token = createToken(user._id);

    // send response with the token
    res.json({
      success: true,
      message: "User Login Successfully!",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function to handle register user
export const registerUser = async (req, res) => {
  try {
    // destructure user's data from req
    const { name, password, email } = req.body;
    // check if a user with the same email address already exists
    const exists = await User.findOne({ email });

    // make the validation
    if (exists) {
      return res.json({ success: false, message: "User Already Exists!" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Provide A Valid Email Address!",
      });
    }

    // validating password strength by it's length
    if (password.length < 8) {
      return res.json({
        success: false,
        message:
          "Please Provide A Strong Password With More Than 8 Characters / Digits!",
      });
    }

    // hashing user's password before saving in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user instance with the provided data
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // save the newly created user to the database
    const user = await newUser.save();

    // generate user's token
    const token = createToken(user._id);

    // send response with the token
    res.json({
      success: true,
      token,
      message: "User Registration Completed Successfully!",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

// controller to register a user
export const register = async (req, res) => {
  // get required fields from req.body
  const { name, email, password } = req.body;
  // check if there are required fields missing
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Required Fields!" });
  }
  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User With This Email Already Exists!",
      });
    }
    // hash password before creating & saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword }); // create user
    await user.save(); // save user to database

    // sign the user's token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

    // send a welcome email
    const mailOptions = {
      form: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome ${name}!`,
      text: `Welcome To Our Website! Your Account Has Been Created Successfully With Email Address: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to login a user
export const login = async (req, res) => {
  // get required fields from req.body
  const { email, password } = req.body;
  // check if there are required fields missing
  if (!email || !password) {
    return res.json({ success: false, message: "Missing Required Fields!" });
  }
  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email Address!",
      });
    }

    // check if the password that the user gave match the password saved in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password!",
      });
    }

    // sign the user's token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
    return res.json({
      success: true,
      message: "User Logged In Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to logout a user
export const logout = async (req, res) => {
  try {
    // clear cookie from the response
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "User Logged Out Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// send verification OTP to the user's email controller
export const sendverifyOtp = async (req, res) => {
  try {
    // get userId from req.body
    const { userId } = req.body;
    // find the user from the database
    const user = await User.findById(userId);

    // check if user's account is verified
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account Is Already Verified!",
      });
    }

    // if user is not verified generate an otp and that otp will be sent in the user's email address
    // generate a random number
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // set the otp in the user's data in the database
    user.verifyOtp = otp;

    // set the expiration date of the otp verification at the user's data in the database (1 day)
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    // save the user with the new details in the database
    await user.save();

    // send with email the otp to the user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "OTP Account Veification",
      // text: `Your OTP Is ${otp}. Verify Your Account Using This OTP.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);

    // return the response
    res.json({
      success: true,
      message: "OTP Verification Email Has Been Sent To The User Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to verify the account's email with the OTP that has been received from the user
export const verifyEmail = async (req, res) => {
  // get the userId and the otp from the user
  // the userId will be sent through the cookie that we have sent to the user so we created a middleware to extract those info from the cookie
  const { userId, otp } = req.body;

  // check if userId or otp are missing
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Required Fields!" });
  }
  try {
    // find the user in the database
    const user = await User.findById(userId);

    // check if user exists
    if (!user) {
      return res.json({
        success: false,
        message: "User With This ID Does Not Exist!",
      });
    }

    // verify the otp that was given by the user
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP!" });
    }

    // check if otp has expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Has Expired!" });
    }

    // verify the user if all checks fail
    user.isAccountVerified = true;

    // reset the verification Otp and the expire date
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    // save the user with the updated data
    await user.save();

    // return success response
    return res.json({
      success: true,
      message: "User's Email Has Been Verified Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to check if user is already authenticated
export const isAuthenticated = async (req, res) => {
  try {
    // this function will execute after the middleware that will check if user is authenticated already so we just send a success response
    res.json({ success: true, message: "Account Is Already Authenticated!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller to send password reset otp
export const sendResetOtp = async (req, res) => {
  // get the email id from the req.body
  const { email } = req.body;

  // check if email is available
  if (!email) {
    return res.json({
      success: false,
      message: "Email Address Is Required  In Order To Reset Password!",
    });
  }
  try {
    // find the user given the email address from req.body
    const user = await User.findOne({ email });

    // check if user with this email exists
    if (!user) {
      return res.json({
        success: false,
        message: "User With This Email Address Does Not Exist!",
      });
    }

    // generate a random number
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // set the otp in the user's data in the database
    user.resetOtp = otp;

    // set the expiration date of the otp verification at the user's data in the database (15 minutes)
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    // save the user with the new details in the database
    await user.save();

    // send with email the otp to the user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "OTP Password Reset",
      // text: `Your OTP For Resetting Your Password Is ${otp}. Use This OTP To Proceed With Your Password Resetting.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOptions);

    // return the response
    res.json({
      success: true,
      message:
        "OTP Password Reset Email Has Been Sent To The User Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// verify the otp and reset password controller
export const resetPassword = async (req, res) => {
  // get users info email, otp, newPassword
  const { email, otp, newPassword } = req.body;

  // check if required fields are missing
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing Required Fields!" });
  }

  try {
    // check if user exists with that credentials
    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
      return res.json({
        success: false,
        message: "User With This Email Address Does Not Exist!",
      });
    }

    // check if otp is empty or not correct
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP!" });
    }

    // check if reset otp has expired
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Has Expired!" });
    }

    // hash the new password in order to securely store it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // reset the resetOtp and the resetOtpExpireAt properties
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    // save the user
    await user.save();

    // return success response
    return res.json({
      success: true,
      message: "Password Has Been Reset Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

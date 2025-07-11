import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { navigate, backendUrl } = useContext(AppContent);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // state variable to check if the reset email was sent
  const [isEmailSent, setIsEmailSent] = useState("");

  // state variable to check if the otp code was sent
  const [otp, setOtp] = useState(0);

  // state variable to check if the otp was submitted
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // send the cookies with the api request/response
  axios.defaults.withCredentials = true;
  const inputRefs = useRef([]);

  // function to move the cursor to the next box immediately when a number is being typed in each box
  const handleInput = (e, index) => {
    // check if we have added a number into the input field and check if the current input field is less than last input field
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      // focus on the next field
      inputRefs.current[index + 1].focus();
    }
  };

  // function to delete the number with backspace
  const handleKeyDown = (e, index) => {
    // check if we have entered the backspace button of the keyboard and we are not in the first field and the input is empty
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      // focus on the previous field and delete the current
      inputRefs.current[index - 1].focus();
    }
  };

  // function to handle copy-paste the 6-digits code from the email that was sent to the user
  const handlePaste = (e) => {
    // variable to store the values copied to the clipboard
    const paste = e.clipboardData.getData("text");
    // split the copied data to paste them each one to the corresponding input field
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // function to handle email submit
  const onSubmitEmail = async (e) => {
    // prevent the default reload form behavior by the browser
    e.preventDefault();
    try {
      // make the api call to send reset password email
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );

      // check the response's data
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to handle otp code submit
  const onSubmitOtp = async (e) => {
    // prevent the default reload form behavior by the browser
    e.preventDefault();
    // add the input values into otpArray variable
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    // set the Otp submitted state to true
    setIsOtpSubmitted(true);
  };

  // function to handle new password submit
  const onSubmitNewPassword = async (e) => {
    // prevent the default reload form behavior by the browser
    e.preventDefault();
    try {
      // make the api call to reset the password with the new one provided by the user
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );

      // check response's data
      data.success ? toast.success(data.message) : toast.error(data.message);
      // if success navigate the user to the home page
      data.success && navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32  cursor-pointer"
      />
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your email address to reset your password.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} className="w-3 h-3" />
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/* Form For The User To Enter The OTP */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digits code sent to your email address.
          </p>
          <div onPaste={handlePaste} className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onInput={(e) => handleInput(e, index)}
                  ref={(e) => (inputRefs.current[index] = e)}
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* Form For The User To Enter The New Password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} className="w-3 h-3" />
            <input
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

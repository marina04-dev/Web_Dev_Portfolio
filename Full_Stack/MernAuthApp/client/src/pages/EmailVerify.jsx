import React, { useContext, useEffect, useRef } from "react";
import { AppContent } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const { navigate, backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContent);
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

  // function to handle verify email api call
  const onSubmitHandler = async (e) => {
    try {
      // prevent the default reload functionality of the website
      e.preventDefault();
      // add the input values into otpArray variable
      const otpArray = inputRefs.current.map((e) => e.value);
      // join the values into a single variable
      const otp = otpArray.join("");
      // send the otp to the backend (make api call)
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      // check the response's data
      if (data.success) {
        // the account was successfully verified
        toast.success(data.message);
        // get the new user data with verified account
        getUserData();
        // navigate the user to the home page
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // redirect the user to the home page if user's account is already verified
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32  cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
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
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;

import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);

  // function make api call to send verification otp
  const sendVerificationOtp = async () => {
    try {
      // send the cookie
      axios.defaults.withCredentials = true;
      // make the api call to the backend
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      // check if otp verification email was sent
      if (data.success) {
        // navigate user to the email verify page
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to logout the user
  const logout = async () => {
    try {
      // set the credentials to true to send the cookie
      axios.defaults.withCredentials = true;
      // call the logout endpoint
      const { data } = await axios.post(backendUrl + "/api/auth/logout");

      // check data response
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      // navigate the user to the home page
      navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 absolute top-0">
      <img src={assets.logo} className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} />
        </button>
      )}
    </div>
  );
};

export default Navbar;

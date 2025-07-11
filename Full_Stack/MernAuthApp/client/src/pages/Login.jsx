import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { navigate, setIsLoggedIn, backendUrl, getUserData } =
    useContext(AppContent);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      // check the current state
      if (state === "Sign Up") {
        // hit the user registration api and store the response in data variable and to send the cookie also we have to declare withCredentials
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        // check the response data
        if (data.success) {
          // set isLoggedIn true
          setIsLoggedIn(true);
          // call getUserData function to get user's data
          getUserData();
          // navigate to home page
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // hit the login api and store the response in data variable and to send the cookie also we have to declare withCredentials
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        // check the response data
        if (data.success) {
          // set isLoggedIn true
          setIsLoggedIn(true);
          // call getUserData function to get user's data
          getUserData();
          // navigate to home page
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-center text-white mb-3">
          {state === "Sign Up" ? "Register" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login To Your Account!"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none"
                type="text"
                required
                placeholder="Full Name"
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none"
              type="email"
              required
              placeholder="Email Address"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none"
              type="password"
              required
              placeholder="Password"
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already Have An Account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't' Have An Account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

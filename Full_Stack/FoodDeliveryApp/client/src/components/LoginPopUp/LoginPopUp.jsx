import React, { useContext, useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../contexts/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPopUp = ({ setShowLogin }) => {
  // state variable to handle register or login display
  const [currentState, setCurrentState] = useState("Login");
  // state variable to handle user's data
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // extract necessary variables/functions from context
  const { backendUrl, setToken } = useContext(StoreContext);

  // function to handle input changes
  const onChangeHandler = (event) => {
    // extract name & value from event
    const name = event.target.name;
    const value = event.target.value;

    // provide the name & value from the input to the setter function
    setData((data) => ({ ...data, [name]: value }));
  };

  // function to handle user's login
  const onLogin = async (e) => {
    try {
      // prevent the default browser's reloading behavior
      e.preventDefault();
      let newUrl = backendUrl;
      // check current state's value
      if (currentState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      // make the api call
      const response = await axios.post(newUrl, data);

      // check response status
      if (response.data.success) {
        // provide the token to the setter function
        setToken(response.data.token);
        // save the token in local storage
        localStorage.setItem("token", response.data.token);
        // close login/register pop up
        setShowLogin(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img src={assets.cross_icon} onClick={() => setShowLogin(false)} />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Sign Up" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By Continuing, You Agree To The Terms Of Use & Privacy.</p>
        </div>
        {currentState === "Login" ? (
          <p>
            Do Not Have An Account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span>
          </p>
        ) : (
          <p>
            Already Have An Account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;

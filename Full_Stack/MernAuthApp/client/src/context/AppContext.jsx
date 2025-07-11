import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // set the credentials to axios to true to get the cookie
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  // function to fetch user data from 'http://localhost:4000/api/user/data' endpoint from the backend
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");

      // check response data
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to check authentication status
  const getAuthState = async () => {
    try {
      // make the api call to get authentication status
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");

      // check data response
      if (data.success) {
        // if user is authenticated setIsLoggedIn true
        setIsLoggedIn(true);
        // and get user's data
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // check if user authentication status whenever the page gets loaded
    getAuthState();
  }, []);

  const value = {
    navigate,
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    setUserData,
    userData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};

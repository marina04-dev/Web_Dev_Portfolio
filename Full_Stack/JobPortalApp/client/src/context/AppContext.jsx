import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const { user } = useUser();
  const { getToken } = useAuth();

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);

  // state variables to manage the recruiter login/sign up
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  // state variable to handle recruiter login pop up
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // state variable to manage user's info
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // function to fetch job data
  const fetchJobs = async () => {
    try {
      // make the api call
      const { data } = await axios.get(backendUrl + "/api/jobs");

      // check response
      if (data.success) {
        setJobs(data.jobs);
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to fetch company data
  const fetchCompanyData = async () => {
    try {
      // make the api call
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken },
      });
      // check response data
      if (data.success) {
        // provide the company data
        setCompanyData(data.company);
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to fetch user data
  const fetchUserData = async () => {
    try {
      // get the user's data
      const token = await getToken();
      // make the api call
      const { data } = await axios.get(backendUrl + "/api/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // check response data
      if (data.success) {
        // provide the user's data in the state variable
        setUserData(data.user);
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to fetch user's applied applications data
  const fetchUserApplications = async () => {
    try {
      // get user's token
      const token = await getToken();
      // make the api call
      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // check response data
      if (data.success) {
        // provide the data to the setter function
        setUserApplications(data.applications);
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // execute fetchJobs each time the component mounts
  useEffect(() => {
    fetchJobs();
    // logic to memorize the provided token
    const storedCompanyToken = localStorage.getItem("companyToken");
    // check if we have the companyToken
    if (storedCompanyToken) {
      // save the token in the state variable
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  // execute fetchCompanyData whenever the component gets loaded/get token
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // fetch user's data whenever the user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  const value = {
    navigate,
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

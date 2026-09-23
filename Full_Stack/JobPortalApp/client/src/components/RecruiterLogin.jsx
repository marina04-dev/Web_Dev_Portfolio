import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  // state variable to manage the popup
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  // state variable to manage next button
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const {
    setShowRecruiterLogin,
    backendUrl,
    setCompanyToken,
    setCompanyData,
    navigate,
  } = useContext(AppContext);

  // function to handle form submission
  const onSubmitHandler = async (e) => {
    // prevent page reload when form submission
    e.preventDefault();
    if (state === "Sign Up" && isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    // make the api call to the backend
    try {
      // check the state
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });
        // check the response data
        if (data.success) {
          // provide the token to the company data
          setCompanyData(data.company);
          // provide the token to the company token
          setCompanyToken(data.token);
          // save the token to the local storage
          localStorage.setItem("companyToken", data.token);
          // close the login pop up
          setShowRecruiterLogin(false);
          // navigate the user to the dashboard page
          navigate("/dashboard");
        } else {
          console.error(data.message);
          toast.error(data.message);
        }
      } else if (state === "Sign Up") {
        // create formData & append the new info
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("image", image);

        // make the api call to the backend
        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData
        );

        // check the response data
        if (data.success) {
          // provide the token to the company data
          setCompanyData(data.company);
          // provide the token to the company token
          setCompanyToken(data.token);
          // save the token to the local storage
          localStorage.setItem("companyToken", data.token);
          // close the login pop up
          setShowRecruiterLogin(false);
          // navigate the user to the dashboard page
          navigate("/dashboard");
        } else {
          console.error(data.message);
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to make the page not scroll whenever the Recruiter Login/Sign Up Pop up is true
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome Back! Please Sign In To Continue.</p>
        {state === "Sign Up" && isTextDataSubmitted ? (
          <>
            {/* Company Logo Submission */}
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
              <p>
                Upload Company <br /> Logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} />
                <input
                  className="outline-none text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} />
              <input
                className="outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} />
              <input
                className="outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}
        {state === "Login" && (
          <p className="text-sm text-blue-600 mt-4 cursor-pointer">
            Forgot Password?
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Register"
            : "Next"}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't Have An Account?{" "}
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already Have An Account?{" "}
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}
        <img
          onClick={(e) => setShowRecruiterLogin(false)}
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;

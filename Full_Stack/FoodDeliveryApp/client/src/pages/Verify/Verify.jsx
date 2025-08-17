import React from "react";
import "./Verify.css";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../contexts/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Verify = () => {
  // search url's params
  const [searchParams, setSearchParams] = useSearchParams();
  // extract success param from url
  const success = searchParams.get("success");
  // extract order's id from url's params
  const orderId = searchParams.get("orderId");

  // get necessary variables & functions from context
  const { backendUrl, navigate, token } = useContext(StoreContext);

  // function to verify order's payment
  const verifyPayment = async () => {
    try {
      // make the api call
      const response = await axios.post(backendUrl + "/api/order/verify", {
        success,
        orderId,
      });

      // check response's status
      if (response.data.success) {
        toast.success(response.data.message);
        // navigate the user to myorders path
        navigate("/myorders");
      } else {
        toast.error(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // execute the payment's verification function whenever the component gets loaded
  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;

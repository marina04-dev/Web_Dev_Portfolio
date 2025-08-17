import React from "react";
import "./MyOrders.css";
import { useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../contexts/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  // state variables to handle orders data display
  const [data, setData] = useState([]);
  // get necessary variables/functions from context
  const { backendUrl, token, currency } = useContext(StoreContext);

  // function to get all user's orders
  const fetchOrders = async () => {
    try {
      // make the api call
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      // provide the response's data to the setter function
      setData(response.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // execute fetchOrders function whenever the token changes or it is available
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p>
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity;
                } else {
                  return item.name + " x " + item.quantity + ", ";
                }
              })}
            </p>
            <p>
              {order.amount}
              {currency}
            </p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf;</span> <b>{order.status}</b>
            </p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;

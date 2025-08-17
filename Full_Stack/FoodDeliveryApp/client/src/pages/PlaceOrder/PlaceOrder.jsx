import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../contexts/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const PlaceOrder = () => {
  // extract necessary variables/functions from context
  const {
    getTotalCartAmount,
    currency,
    token,
    foodList,
    cartItems,
    backendUrl,
    navigate,
  } = useContext(StoreContext);

  // state variables to handle order data
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // function to handle input changes
  const onChangeHandler = (event) => {
    // extract name from event
    const name = event.target.name;
    // extract value from event
    const value = event.target.value;
    // provide the name & value from the event to the setter function
    setData((data) => ({ ...data, [name]: value }));
  };

  // function to place a user's order
  const placeOrder = async (e) => {
    try {
      // prevent the default browser's behavior from reloading
      e.preventDefault();
      // get the order's items
      let orderItems = [];
      // loop through the foodList
      foodList.map((item) => {
        // check each product's cart quantity
        if (cartItems[item._id] > 0) {
          // get individual item's info
          let itemInfo = item;
          // add to item's info object quantity property with the corresponding one from the cart's
          itemInfo["quantity"] = cartItems[item._id];
          // push the item with it's info to the orderItems
          orderItems.push(itemInfo);
        }
      });

      // create order's data object with the data provided from the user from the inputs (all are required)
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2, // delivery fee (2 euros)
      };

      // make the api call to place the order
      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      // check response's status
      if (response.data.success) {
        // get response's success url
        const session_url = response.data.session_url;
        // redirect the user to the payment url
        window.location.replace(session_url);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // if we do not have a token navigate back to cart page
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last Name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email Address"
          required
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Recipient Address"
          required
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Postal / ZIP Code"
            required
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            required
          />
        </div>
        <input
          type="tel"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone Number"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {getTotalCartAmount()}
                {currency}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fees</p>
              <p>
                {getTotalCartAmount() === 0 ? 0 : 2}
                {currency}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
                {currency}
              </b>
            </div>
          </div>
          <button type="submit">Proceed To Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

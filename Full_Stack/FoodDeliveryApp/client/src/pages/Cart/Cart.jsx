import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../contexts/StoreContext";

const Cart = () => {
  const {
    foodList,
    currency,
    removeFromCart,
    cartItems,
    getTotalCartAmount,
    navigate,
    backendUrl,
  } = useContext(StoreContext);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={backendUrl + "/images/" + item.image} />
                  <p>{item.name}</p>
                  <p>
                    {item.price}
                    {currency}
                  </p>
                  <p>{cartItems[item._id]}</p>
                  <p>
                    {item.price * cartItems[item._id]}
                    {currency}
                  </p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
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
          <button onClick={() => navigate("/order")}>
            Proceed To Checkout
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If You Have A Promo Code, Enter It Here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

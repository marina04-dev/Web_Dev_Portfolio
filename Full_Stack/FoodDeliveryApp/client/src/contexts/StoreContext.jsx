import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // state variables to manage cart items
  const [cartItems, setCartItems] = useState({});
  // state variables to handle user's token
  const [token, setToken] = useState("");
  // state variables to handle food list
  const [foodList, setFoodList] = useState([]);

  // function to handle add to cart
  const addToCart = async (itemId) => {
    try {
      // check if user adds the item for the 1st time
      if (!cartItems[itemId]) {
        setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
        // increase the amount of itemId in the cart
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }

      // if token exists make the api call
      if (token) {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to handle remove from cart
  const removeFromCart = async (itemId) => {
    try {
      // decrease the amount of itemId in the cart
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

      // if token exists make the api call
      if (token) {
        await axios.post(
          backendUrl + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to calculate cart's total
  const getTotalCartAmount = () => {
    // initialize the variable where we will store total
    let totalAmount = 0;
    // loop throught each item of the cart
    for (const item in cartItems) {
      // execute the block of code only if the product's quantity is greater than zero
      if (cartItems[item] > 0) {
        // find the cart's products
        let itemInfo = foodList.find((product) => product._id === item);
        // multiply the product's price with it's quantity
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // function to get all foods
  const fetchFoodList = async () => {
    try {
      // make the api call
      const response = await axios.get(backendUrl + "/api/food/list");
      // check response status
      if (response.data.success) {
        // provide the response data to the setter function
        setFoodList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to load cart data
  const loadCartData = async (token) => {
    try {
      // make the api call
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      // check response's status
      if (response.data.success) {
        // provide the retrieved data to the setter function
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // fix the error of whenever the page gets reloaded the user logs out so that the token stays saved & the user stays logged in
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    foodList,
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    setCartItems,
    navigate,
    getTotalCartAmount,
    backendUrl,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

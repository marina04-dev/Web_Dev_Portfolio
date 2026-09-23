import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../contexts/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  // state variable to manage menu display
  const [menu, setMenu] = useState("Home");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // extract necessary variables/functions from context
  const { getTotalCartAmount, token, setToken, navigate } =
    useContext(StoreContext);

  // function to handle user's logout
  const logout = () => {
    try {
      // remove the token from local storage
      localStorage.removeItem("token");
      // remove the token from the setter function
      setToken("");
      // navigate to the home page
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("Menu")}
          className={menu === "Menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("Mobile App")}
          className={menu === "Mobile App" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("Contact")}
          className={menu === "Contact" ? "active" : ""}
        >
          Contact
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div
            className="navbar-profile"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <img src={assets.profile_icon} alt="Profile Icon" />
            <ul
              style={{ display: dropdownVisible ? "flex" : "none" }}
              className="nav-profile-dropdown"
            >
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="Bag Icon" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout Icon" />
                <p>Log Out</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

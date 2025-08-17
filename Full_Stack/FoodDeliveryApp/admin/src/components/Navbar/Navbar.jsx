import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/admin_assets/assets";

const Navbar = () => {
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} />
      <img src={assets.profile_image} className="profile" />
    </div>
  );
};

export default Navbar;

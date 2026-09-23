import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Orders from "./pages/Orders/Orders";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const App = () => {
  // get backend URL
  const backendUrl = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add backendUrl={backendUrl} />} />
          <Route path="/list" element={<List backendUrl={backendUrl} />} />
          <Route path="/orders" element={<Orders backendUrl={backendUrl} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

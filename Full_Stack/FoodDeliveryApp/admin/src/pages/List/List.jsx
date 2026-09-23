import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ backendUrl }) => {
  // state variables to handle foods display
  const [list, setList] = useState([]);

  // function to get all foods
  const fetchList = async () => {
    try {
      // make the api call
      const response = await axios.get(backendUrl + "/api/food/list");
      // check response status
      if (response.data.success) {
        // provide the response's data to the setter function
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to handle remove food functionality
  const removeFood = async (foodId) => {
    try {
      // make the api call
      const response = await axios.post(`${backendUrl}/api/food/remove`, {
        id: foodId,
      });
      // check response status
      if (response.data.success) {
        toast.success(response.data.message);
        // fetch the updated food list
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // execute whenever the component gets loaded
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${backendUrl}/images/${item.image}`} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}€</p>
              <p className="cursor" onClick={() => removeFood(item._id)}>
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;

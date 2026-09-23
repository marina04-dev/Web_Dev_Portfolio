import fs from "fs";
import Food from "../models/Food.js";

// API to add new food
const addFood = async (req, res) => {
  try {
    // get the filename from req.file.filename
    let image_filename = `${req.file.filename}`;

    // create new food with the request's data
    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    // save the newly created food in the database
    await food.save();

    // send back the response
    res
      .status(200)
      .json({ success: true, message: "New Food Created Successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to display all food list
const listFood = async (req, res) => {
  try {
    // get foods from database
    const foods = await Food.find({});
    // return the response with the food data
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to remove food
const removeFood = async (req, res) => {
  try {
    // find the food we want to delete
    const food = await Food.findById(req.body.id);
    // delete the food image from the uploads folder
    fs.unlink(`uploads/${food.image}`, () => {});

    // delete the food from the database
    await Food.findByIdAndDelete(req.body.id);
    // return success response
    res
      .status(200)
      .json({ success: true, message: "Food Item Deleted Successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood };

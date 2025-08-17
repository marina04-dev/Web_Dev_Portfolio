import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodcontrollers.js";
import upload from "../config/multer.js";

// create food router
const foodRouter = express.Router();

// POST: route to add new food
foodRouter.post("/add", upload.single("image"), addFood);
// GET: route to get all foods
foodRouter.get("/list", listFood);
// POST: route to delete single food by id
foodRouter.post("/remove", removeFood);

export default foodRouter;

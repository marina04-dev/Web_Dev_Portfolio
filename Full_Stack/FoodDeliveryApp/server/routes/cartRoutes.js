import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

// create car router
const cartRouter = express.Router();

// POST: add items to user's cart
cartRouter.post("/add", authMiddleware, addToCart);
// POST: remove items from user's cart
cartRouter.post("/remove", authMiddleware, removeFromCart);
// POST: get all items from user's cart & display them to user's cart
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;

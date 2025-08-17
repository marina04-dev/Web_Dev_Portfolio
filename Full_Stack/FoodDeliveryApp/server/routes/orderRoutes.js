import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/orderControllers.js";

// create order router
const orderRouter = express.Router();

// POST: place an order
orderRouter.post("/place", authMiddleware, placeOrder);
// POST: verify a placed order
orderRouter.post("/verify", verifyOrder);
// POST: get all user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);
// GET: get all orders from all users
orderRouter.get("/list", listOrders);
// POST: update order's status
orderRouter.post("/status", updateStatus);

export default orderRouter;

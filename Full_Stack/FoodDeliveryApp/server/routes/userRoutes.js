import express from "express";
import { loginUser, registerUser } from "../controllers/userControllers.js";

// create user's router
const userRouter = express.Router();

// POST: register a user
userRouter.post("/register", registerUser);
// POST: login a user
userRouter.post("/login", loginUser);

export default userRouter;

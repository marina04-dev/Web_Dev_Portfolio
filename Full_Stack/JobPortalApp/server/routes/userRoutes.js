import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();

// get user data
userRouter.get("/user", getUserData);
// apply for a job
userRouter.post("/apply", applyForJob);
// get applied jobs data
userRouter.get("/applications", getUserJobApplications);
// update user profile (resume)
userRouter.post("/update-resume", upload.single("resume"), updateUserResume);

export default userRouter;

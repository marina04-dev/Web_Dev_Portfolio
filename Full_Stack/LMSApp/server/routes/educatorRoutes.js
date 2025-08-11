import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
} from "../controllers/educatorControllers.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router();

// POST: update user's role to educator
educatorRouter.post("/update-role", updateRoleToEducator);
// POST: add course
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);
// GET: get all educator's courses
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
// GET: get educator's dashboard data
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
// GET: get educator's enrolled students who have 'Completed' status on their purchase
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;

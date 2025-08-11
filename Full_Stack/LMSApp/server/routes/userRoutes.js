import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userControllers.js";

// create user router
const userRouter = express.Router();

// GET: get user's data
userRouter.get("/data", getUserData);
// GET: get user's enrolled courses
userRouter.get("/enrolled-courses", userEnrolledCourses);
// POST: purchase a course
userRouter.post("/purchase", purchaseCourse);
// POST: update user's course progress
userRouter.post("/update-course-progress", updateUserCourseProgress);
// GET: get user's course progress
userRouter.get("/get-course-progress", getUserCourseProgress);
// POST: add user's course rating
userRouter.post("/add-rating", addUserRating);

export default userRouter;

import express from "express";
import {
  getAllCourses,
  getCourseById,
} from "../controllers/courseControllers.js";

const courseRouter = express.Router();

// GET: all published courses
courseRouter.get("/all", getAllCourses);
// GET: a course by id
courseRouter.get("/:id", getCourseById);

export default courseRouter;

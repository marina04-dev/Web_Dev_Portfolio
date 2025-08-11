import mongoose from "mongoose";

// create course progress schema
const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimize: false }
);

// create course progress model
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;

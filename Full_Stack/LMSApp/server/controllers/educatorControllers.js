import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

// API function to update user's role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    // extract userId from req.auth
    const userId = req.auth.userId;

    // update user's role
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    // send back the response
    res.json({
      success: true,
      message: "User's Role Updated Successfully To Educator!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API function to add new course
export const addCourse = async (req, res) => {
  try {
    // extract course data from req.body
    const { courseData } = req.body;

    // extract image file from req.file
    const imageFile = req.file;

    // extract educatorId from req.auth.userId
    const educatorId = req.auth.userId;

    // check if imageFile is available
    if (!imageFile) {
      return res.json({
        success: false,
        message: "Course Thumbnail Is Required!",
      });
    }

    // parse course data with JSON
    const parsedCourseData = await JSON.parse(courseData);

    // add educator to the parsed course data
    parsedCourseData.educator = educatorId;

    // create the new course
    const newCourse = await Course.create(parsedCourseData);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    // send the response
    res.json({ success: true, message: "New Course Added Successfully!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API function to get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const educator = req.auth.userId;

    // find educator's courses
    const courses = await Course.find({ educator });

    // send back the response
    res.json({ success: true, courses });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get educator dashboard data & statistics
export const educatorDashboardData = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const educator = req.auth.userId;

    // find educator's courses
    const courses = await Course.find({ educator });
    // find educator's total number of courses
    const totalCourses = courses.length;

    // get each educator's course's id
    const courseIds = courses.map((course) => course._id);

    // calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "Completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // collect unique enrolled students ids with their course titles
    const enrolledStudentsData = [];
    for (let course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    // send back success response with educator's dashboard data
    res.json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsData, totalCourses },
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const educator = req.auth.userId;

    // find educator's courses
    const courses = await Course.find({ educator });

    // get each educator's course's id
    const courseIds = courses.map((course) => course._id);

    // find Completed purchases & populate with student's info & course's info
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "Completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    // create object with purchases data
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    // send back with the response the enrolledStudents
    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

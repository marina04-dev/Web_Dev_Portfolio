import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import CourseProgress from "../models/CourseProgress.js";

// API to get user's data
export const getUserData = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // find the user with this id
    const user = await User.findById(userId);

    // check if user with this id exists in the database
    if (!user) {
      return res.json({
        success: false,
        message: "User With This Id Does Not Exist!",
      });
    }

    // send back the response with user's data
    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get user's enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // find the user with this id & populate with enrolledCourses
    const userData = await User.findById(userId).populate("enrolledCourses");

    // send back the response with userData
    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to let a user purchase a course
export const purchaseCourse = async (req, res) => {
  try {
    // extract courseId from req.body
    const { courseId } = req.body;

    // extract origin from req.headers
    const { origin } = req.headers;

    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // find the user with this id
    const userData = await User.findById(userId);

    // find the course with this id
    const courseData = await Course.findById(courseId);

    // check if user & course with this id exists in our database
    if (!userData || !courseData) {
      return res.json({
        success: false,
        message: "User Or Course With This Id Does Not Exist!",
      });
    }

    // create purchase data
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    // create new purchase & save it in the database
    const newPurchase = await Purchase.create(purchaseData);

    // initialize stripe gateway
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    // get env variable's currency
    const currency = process.env.CURRENCY.toLowerCase();

    // create line items for stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    // create a payment session
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    // send back the response with session's url
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to update user's course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // extract courseId & lectureId from req.body
    const { courseId, lectureId } = req.body;

    // get user's current course progress
    const progressData = await CourseProgress.findOne({ userId, courseId });

    // check if progressData exists
    if (progressData) {
      // check if the lecture with this id has already been completed
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "This Lecture Has Been Already Completed!",
        });
        // push the new lecture's id to completed
        progressData.lectureCompleted.push(lectureId);

        // save the new updated data in the database
        await progressData.save();
      } else {
        // we do not have a progress so create from start
        await CourseProgress.create({
          userId,
          courseId,
          lectureCompleted: [lectureId],
        });
      }
    }
    // send back the success response
    res.json({
      success: true,
      message: "Course Progress Updated Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get user's course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // extract courseId & lectureId from req.body
    const { courseId, lectureId } = req.body;

    // get user's current course progress
    const progressData = await CourseProgress.findOne({ userId, courseId });

    // send back the response with progressData
    res.json({ success: true, progressData });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to add user ratings to course
export const addUserRating = async (req, res) => {
  try {
    // extract userId from req.auth.userId
    const userId = req.auth.userId;

    // extract courseId & rating from req.body
    const { courseId, rating } = req.body;

    // check if any of the id's or rating is not available or not between the expected values
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message:
          "Missing Required Information Or Invalid Details Have Been Provided!",
      });
    }

    // find course by it's id
    const course = await Course.findById(courseId);

    // check if the course with this id does not exist in the database
    if (!course) {
      return res.json({
        success: false,
        message: "Course With This Id Does Not Exist!",
      });
    }

    // find user by it's id
    const user = await User.findById(userId);

    // check if the user with this id does not exist in the database or the courseId is not in the user's enrolledCourses
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message:
          "User With This Id Does Not Exist Or This Course Has Not Been Purchased By This User!",
      });
    }

    // check if user has already rated this course
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    // check if existingRatingIndex is not -1 (userId has not been found)
    if (existingRatingIndex > -1) {
      // update the user's course rating
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      // add the new user with his rating in the course's rating
      course.courseRatings.push({ userId, rating });
    }

    // save the new/updated data in the database
    await course.save();

    // send back the response
    res.json({
      success: true,
      message: "User's Course Rating Added Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

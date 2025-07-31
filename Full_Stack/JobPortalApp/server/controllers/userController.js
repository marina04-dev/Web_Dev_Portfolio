import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// get user data controller
export const getUserData = async (req, res) => {
  // get user id from req.auth.userId
  const userId = req.auth.userId;
  try {
    // find the user by id
    const user = await User.findById(userId);

    // check if user exists
    if (!user) {
      return res.json({ success: false, message: "User Does Not Exist!" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// apply for a job controller
export const applyForJob = async (req, res) => {
  // take the job id from req.body
  const { jobId } = req.body;
  //take the user id for authentication
  const userId = req.auth.userId;

  try {
    // check if the user has already applied for that job
    const hasAlreadyApplied = await JobApplication.find({ jobId, userId });

    // check if the result is > 0
    if (hasAlreadyApplied.length > 0) {
      return res.json({
        success: false,
        message: "User Has Already Applied For That Job!",
      });
    }

    // find the job by id
    const jobData = await Job.findById(jobId);

    // check if there is no jobData (means the user is applying for a job that is not available in our database)
    if (!jobData) {
      return res.json({
        success: false,
        message: "Job With This Id Is Not Available!",
      });
    }

    // create the job application
    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });
    res.json({
      success: true,
      message: "User Application Completed Successfully!",
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user applied applications controller
export const getUserJobApplications = async (req, res) => {
  try {
    // take the userId
    const userId = req.auth.userId;
    // find user's applications & polulate company & job
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec(); // execute the query

    // check if we do not have applications
    if (!applications) {
      return res.json({
        success: false,
        message: "No Job Applications Has Been Made By The User Yet!",
      });
    }
    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// update user profile (resume) controller
export const updateUserResume = async (req, res) => {
  try {
    // take the userId
    const userId = req.auth.userId;
    // get resume file from req.file
    const resumeFile = req.file;

    // find the userData with this id
    const userData = await User.findById(userId);

    // check if we have any the resume file
    if (resumeFile) {
      // update user's resume on cloudinary platform & attach the updated resume in the userData
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    // save the updated data in the database
    await userData.save();

    res.json({ success: true, message: "Resume Updated Successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

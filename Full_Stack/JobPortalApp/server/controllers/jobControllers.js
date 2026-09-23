import Job from "../models/Job.js";

// get all jobs controller
export const getAllJobs = async (req, res) => {
  try {
    // get all visible jobs from the database
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get single job by id controller
export const getJobById = async (req, res) => {
  // get job id from url params
  const { id } = req.params;

  // find the job from the database
  const job = await Job.findById(id).populate({
    path: "companyId",
    select: "-password",
  });

  // check if job with the provided id exists
  if (!job) {
    return res.json({
      success: false,
      message: "Job With This ID Does Not Exist!",
    });
  }

  res.json({ success: true, job });

  try {
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

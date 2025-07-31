import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// register a new company controller function
export const registerCompany = async (req, res) => {
  // get company's data from req.body
  const { name, email, password } = req.body;

  // get company's logo
  const imageFile = req.file;

  // check if required data are missing
  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Required Fields!" });
  }

  // check if company already exists
  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({
        success: false,
        message: "Company Already Registered!",
      });
    }

    // hash password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload imageFile on cloudinary platform
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    // save company data in the database
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });
    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// login a company controller function
export const loginCompany = async (req, res) => {
  // get email address and password from req.body
  const { email, password } = req.body;

  try {
    // find company by email
    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({ success: false, message: "Invalid Credentials!" });
    }

    // compare password
    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get company data controller function
export const getCompanyData = async (req, res) => {
  try {
    // get company data through authMiddleware
    const company = req.company;

    res.json({ success: true, company });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// post a new job controller function
export const postJob = async (req, res) => {
  // get job data from req.body
  const { title, description, location, salary, level, category } = req.body;
  // use authMiddleware to get companyId from req.company
  const companyId = req.company._id;

  // create new job with the provided data
  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      date: Date.now(),
      companyId,
      level,
      category,
    });

    // save new job to the database
    await newJob.save();

    res.json({ success: true, newJob });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get company job applicants controller function
export const getCompanyJobApplicants = async (req, res) => {
  try {
    // get the companyId from req.company data
    const companyId = req.company._id;
    // find job applicants for the user & populate related data
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();

    // provide the applications to the response
    return res.json({ success: true, applications });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get company posted jobs controller function
export const getCompanyPostedJobs = async (req, res) => {
  try {
    // get company id from req.company
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });
    // add total applicants to the job info
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );
    res.json({ success: true, jobsData });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// change job application status controller function
export const changeJobApplicationsStatus = async (req, res) => {
  try {
    // get the id & status from req.body
    const { id, status } = req.body;
    // find job application & update status
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "Job Status Changed Successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// change job visibility controller function
export const changeJobVisibility = async (req, res) => {
  try {
    // get job id from req.body
    const { id } = req.body;
    // get company id from req.company
    const companyId = req.company._id;
    // find job by id
    const job = await Job.findById({ id });
    // check if companyId is equall to the job's companyId
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }

    // save the updated data with the new info
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

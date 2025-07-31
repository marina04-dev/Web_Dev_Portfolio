import express from "express";
import {
  changeJobApplicationsStatus,
  changeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyControllers.js";
import upload from "../configs/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";

const companyRouter = express.Router();

// register a company
companyRouter.post("/register", upload.single("image"), registerCompany);
// login a company
companyRouter.post("/login", loginCompany);
// get company data
companyRouter.get("/company", protectCompany, getCompanyData);
// post a job
companyRouter.post("/post-job", protectCompany, postJob);
// get applicants data of company
companyRouter.get("/applicants", protectCompany, getCompanyJobApplicants);
// get company job list
companyRouter.get("/list-jobs", protectCompany, getCompanyPostedJobs);
// change application status
companyRouter.post(
  "/change-status",
  protectCompany,
  changeJobApplicationsStatus
);
// change job visibility
companyRouter.post("/change-visibility", protectCompany, changeJobVisibility);

export default companyRouter;

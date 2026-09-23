import express from "express";
import { getAllJobs, getJobById } from "../controllers/jobControllers.js";

const jobRouter = express.Router();

// get all jobs
jobRouter.get("/", getAllJobs);
// get a single job by id
jobRouter.get("/:id", getJobById);

export default jobRouter;

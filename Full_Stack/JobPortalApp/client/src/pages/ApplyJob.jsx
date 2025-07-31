import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const ApplyJobs = () => {
  // according to the id from the url
  const { id } = useParams();
  const { getToken } = useAuth();
  const [jobData, setJobData] = useState(null);
  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    navigate,
    fetchUserApplications,
  } = useContext(AppContext);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);

  // function to fetch job data
  const fetchJob = async () => {
    try {
      // make the api call
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);

      // check response
      if (data.success) {
        // setJobData with the response's data
        setJobData(data.jobs);
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to handle apply for a job functionality
  const applyHandler = async () => {
    try {
      // check if we do not have any user's data
      if (!userData) {
        // navigate the user to the applications page
        navigate("/applications");
        // try to apply without registering/login
        return toast.error("Register/Login To Apply For A Job!");
      }

      // check if we have user's data but not resume
      if (!userData.resume) {
        return toast.error("Upload Your Resume To Apply For A Job!");
      }

      // generate user's token
      const token = await getToken();
      // make the api call
      const { data } = await axios.post(
        backendUrl + "/api/users/apply",
        {
          jobId: jobData._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // check response
      if (data.success) {
        toast.success(data.message);
        // refresh with the updated user's applications
        fetchUserApplications();
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to see if a user has already applied for a job
  const checkAlreadyApplied = async () => {
    try {
      // check if user has already applied
      const hasApplied = userApplications.some(
        (item) => item.jobId._id === jobData._id
      );
      setHasAlreadyApplied(hasApplied);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // execute fetchJob function whenever our component's (gets rendered), job id changes
  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied();
    }
  }, [jobData, userApplications, id]);

  return jobData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={jobData.companyId.image}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded"
              >
                {hasAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10"
              >
                Apply Now
              </button>
            </div>
            {/* Right Section More Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More Jobs From {jobData.companyId.name}</h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id
                )
                .filter((job) => {
                  // set of applied jobIds
                  const appliedJobsIds = new Set(
                    userApplications.map((app) => app.jobId && app.jobId._id)
                  );
                  // return true if the user has not already applied for this job
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJobs;

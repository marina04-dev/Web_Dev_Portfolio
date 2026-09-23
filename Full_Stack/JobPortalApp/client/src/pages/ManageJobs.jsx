import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const { navigate, backendUrl, companyToken } = useContext(AppContext);

  // state variables to manage jobs
  const [jobs, setJobs] = useState(false);

  // fetch company's posted jobs
  const fetchCompanyJobs = async () => {
    try {
      // make the api call
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      // check response
      if (data.success) {
        // setJobs with the fetched data
        setJobs(data.jobsData.reverse());
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // function to change job visibility within the input checkbox field
  const changeJobVisibility = async (id) => {
    try {
      // make the api call
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id },
        { headers: { token: companyToken } }
      );

      // check the response
      if (data.success) {
        toast.success(data.message);
        // fetch the latest companyData to show in the page
        fetchCompanyJobs();
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // call setCompanyJobs whenever the page gets loaded
  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return jobs ? (
    jobs.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No Jobs Available!</p>
      </div>
    ) : (
      <div className="container p-4 max-w-5xl">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  #
                </th>
                <th className="py-2 px-4 border-b text-left">Job Title</th>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  Date
                </th>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  Location
                </th>
                <th className="py-2 px-4 border-b text-center">
                  Total Applicants
                </th>
                <th className="py-2 px-4 border-b text-left">Visible</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{job.title}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.location}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {job.applicants}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      className="scale-125 ml-4"
                      type="checkbox"
                      checked={job.visible}
                      onChange={() => changeJobVisibility(job._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-black text-white py-2 px-4 rounded"
            onClick={() => navigate("/dashboard/add-job")}
          >
            Add New Job
          </button>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;

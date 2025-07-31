import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const AddJob = () => {
  // state variables to store the input fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programming");
  const [location, setLocation] = useState("Bangalore");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState(0);

  // quill editor ref initialize
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  // initialize the Quill whenever the component gets rendered
  useEffect(() => {
    // in video said !editorRef.current
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  // function to handle form submission
  const onSubmitHandler = async (e) => {
    // prevent the default reload browser behaviour
    e.preventDefault();
    try {
      // get the job description
      const description = quillRef.current.root.innerHTML;
      // make the api call
      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        {
          title,
          description,
          location,
          salary,
          category,
          level,
        },
        { headers: { token: companyToken } }
      );

      // check response
      if (data.success) {
        toast.success(data.message);
        // reset the fields
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="container flex flex-col p-4 w-full items-start gap-3"
    >
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
          type="text"
          placeholder="Type Here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select
            value={category}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div>
          <p className="mb-2">Job Location</p>
          <select
            value={location}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((location, index) => (
              <option value={location} key={index}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div>
          <p className="mb-2">Job Level</p>
          <select
            value={level}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>
      <div>
        <p className="mb-2">Job Salary</p>
        <input
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          min={0}
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
      </div>
      <button className="w-28 py-3 mt-4 bg-black text-white rounded">
        Add Job
      </button>
    </form>
  );
};

export default AddJob;

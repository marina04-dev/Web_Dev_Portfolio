import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/students/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/students/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/students/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  // get the search bar's input from url params
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  // change whenever allCourses/input changes
  useEffect(() => {
    // logic to filter the courses based on the keywords if provided on the search bar
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      // check if we have input provided
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Courses List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Courses List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {/* Delete Filter Icon: if we have entered an input display the delete icon that when clicked returns to the initial courses list */}
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}
        {/* Display The Filtered Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;

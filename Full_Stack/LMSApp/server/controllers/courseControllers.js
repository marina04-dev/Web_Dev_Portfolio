import Course from "../models/Course.js";

// API to get all website's courses
export const getAllCourses = async (req, res) => {
  try {
    // find all published courses from the Course model & extract sensitive/unuseful info & populate with educator's data
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    // send back the response with the courses data
    res.json({ success: true, courses });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get a course by it's id
export const getCourseById = async (req, res) => {
  // get course's id by url's params
  const { id } = req.params;
  try {
    // find the course with this id & populate with educator's data
    const courseData = await Course.findById(id).populate({ path: "educator" });

    // remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    // send back the response with the course
    res.json({ success: true, courseData });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

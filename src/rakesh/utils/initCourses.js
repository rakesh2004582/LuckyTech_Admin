import coursesData from "../data/course.json";

export const initCourses = () => {
  const stored = localStorage.getItem("courses");

  if (!stored) {
    localStorage.setItem(
      "courses",
      JSON.stringify(coursesData.courses)
    );
  }
};

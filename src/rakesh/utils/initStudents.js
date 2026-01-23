import studentsData from "../data/student.json";

export const initStudents = () => {
const stored = localStorage.getItem("students");

  if (!stored) {
    localStorage.setItem("students", JSON.stringify(studentsData.students));
  }
}

// util files to initialize local storage for students and courses
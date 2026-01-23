import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Phone, BookOpen, Calendar, X } from "lucide-react";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    enrollmentDate: "",
    status: "Active",
  });

  /* ✅ Load courses from localStorage */
  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    setCourses(storedCourses ? JSON.parse(storedCourses) : []);
  }, []);

  const COURSE_NAMES = courses.map((c) => c.course_name);

  /* ✅ Load student by ID */
  useEffect(() => {
    const students =
      JSON.parse(localStorage.getItem("students")) || [];

    const student = students.find((s) => s.id === id);

    if (!student) {
      alert("Student not found");
      navigate("/admin/dashboard");
      return;
    }

    setFormData(student);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.course) {
      alert("Please select a course");
      return;
    }

    const students =
      JSON.parse(localStorage.getItem("students")) || [];

    const updatedStudents = students.map((s) =>
      s.id === id ? { ...s, ...formData } : s
    );

    localStorage.setItem(
      "students",
      JSON.stringify(updatedStudents)
    );

    alert("✅ Student updated successfully!");
    navigate("/admin/dashboard");
  };

  return (
    <div className="bg-gray-50 px-4 py-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <h2 className="text-base font-semibold text-gray-800">
            Edit Student
          </h2>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div>
            <label className="text-xs font-medium">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-9 py-1.5 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-9 py-1.5 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium">Phone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-9 py-1.5 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Course */}
          <div>
            <label className="text-xs font-medium">Course</label>
            <div className="relative">
              <BookOpen size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full pl-9 py-1.5 border rounded-md text-sm bg-white"
              >
                <option value="" disabled>
                  Select Course
                </option>

                {COURSE_NAMES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="text-xs font-medium">
              Enrollment Date
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
                className="w-full pl-9 py-1.5 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full py-1.5 border rounded-md text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Update Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;

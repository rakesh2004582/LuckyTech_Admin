import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  X,
} from "lucide-react";

// import studentsData from "../../data/student.json";

const AddStudent = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState(
    () => JSON.parse(localStorage.getItem("courses")) || []
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    enrollmentDate: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateStudentId = (students) => {
    const numbers = students.map((s) =>
      parseInt(s.id.replace("ST", ""), 10)
    );
    const max = numbers.length ? Math.max(...numbers) : 0;
    return `ST${String(max + 1).padStart(3, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.course) {
      alert("Please select a course");
      return;
    }

    const storedStudents =
      JSON.parse(localStorage.getItem("students"))

    const newStudent = {
      id: generateStudentId(storedStudents),
      ...formData,
      avatar: `https://placehold.co/40x40/3b82f6/ffffff?text=${formData.name
        .charAt(0)
        .toUpperCase()}`,
    };

    localStorage.setItem(
      "students",
      JSON.stringify([...storedStudents, newStudent])
    );

    navigate("/students/all");
  };

  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <h2 className="text-lg font-semibold">Add New Student</h2>
          <button onClick={() => navigate("/admin/students/all")}>
            <X />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input label="Full Name" icon={<User size={16} />} name="name" value={formData.name} onChange={handleChange} />
          <Input label="Email" icon={<Mail size={16} />} name="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone" icon={<Phone size={16} />} name="phone" value={formData.phone} onChange={handleChange} />

          <Select
            label="Course"
            icon={<BookOpen size={16} />}
            name="course"
            value={formData.course}
            onChange={handleChange}
            options={courses.map(c => c.course_name)}
            placeholder="Select Course"
          />

          <Input
            label="Enrollment Date"
            icon={<Calendar size={16} />}
            type="date"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["Active", "Inactive", "Pending"]}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
      <input {...props} required className="w-full pl-10 pr-4 py-2 border rounded-lg" />
    </div>
  </div>
);

const Select = ({ label, icon, options, placeholder, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
      <select {...props} required className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  </div>
);

export default AddStudent;

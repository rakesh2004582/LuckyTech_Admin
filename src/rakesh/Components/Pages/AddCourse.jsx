// import React, { useEffect, useState } from "react";

// const AddCourse = () => {
//   const [courses, setCourses] = useState(() =>
//     JSON.parse(localStorage.getItem("courses")) || []
//   );
//   const [form, setForm] = useState({
//     category: "",
//     course_name: "",
//     duration_months: "",
//     total_fees: "",
//     monthly_fees: "",
//     topics: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (Object.values(form).some((v) => !v)) {
//       alert("All fields required");
//       return;
//     }

//     const exists = courses.find(
//       (c) => c.course_name === form.course_name
//     );

//     if (exists) {
//       alert("Course already exists");
//       return;
//     }

//     const updated = [
//       ...courses,
//       {
//         ...form,
//         duration_months: Number(form.duration_months),
//         total_fees: Number(form.total_fees),
//         monthly_fees: Number(form.monthly_fees),
//       },
//     ];

//     localStorage.setItem("courses", JSON.stringify(updated));
//     setCourses(updated);

//     setForm({
//       category: "",
//       course_name: "",
//       duration_months: "",
//       total_fees: "",
//       monthly_fees: "",
//       topics: "",
//     });

//     alert("Course added successfully");
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-lg font-semibold mb-4">Add Course</h2>

//       <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border p-2 mb-2" />
//       <input name="course_name" placeholder="Course Name" value={form.course_name} onChange={handleChange} className="w-full border p-2 mb-2" />
//       <input name="duration_months" type="number" placeholder="Duration (months)" value={form.duration_months} onChange={handleChange} className="w-full border p-2 mb-2" />
//       <input name="total_fees" type="number" placeholder="Total Fees" value={form.total_fees} onChange={handleChange} className="w-full border p-2 mb-2" />
//       <input name="monthly_fees" type="number" placeholder="Monthly Fees" value={form.monthly_fees} onChange={handleChange} className="w-full border p-2 mb-2" />
//       <textarea name="topics" placeholder="Topics" value={form.topics} onChange={handleChange} className="w-full border p-2 mb-4" />

//       <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded">
//         Save Course
//       </button>
//     </div>
//   );
// };

// export default AddCourse;
import React, { useEffect, useState } from "react";

const AddCourse = () => {
  const [courses, setCourses] = useState(() =>
    JSON.parse(localStorage.getItem("courses")) || []
  );
  const [form, setForm] = useState({
    category: "",
    course_name: "",
    duration_months: "",
    total_fees: "",
    monthly_fees: "",
    topics: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (Object.values(form).some((v) => !v)) {
      alert("All fields required");
      return;
    }

    const exists = courses.find(
      (c) => c.course_name === form.course_name
    );

    if (exists) {
      alert("Course already exists");
      return;
    }

    const updated = [
      ...courses,
      {
        ...form,
        duration_months: Number(form.duration_months),
        total_fees: Number(form.total_fees),
        monthly_fees: Number(form.monthly_fees),
      },
    ];

    localStorage.setItem("courses", JSON.stringify(updated));
    setCourses(updated);

    setForm({
      category: "",
      course_name: "",
      duration_months: "",
      total_fees: "",
      monthly_fees: "",
      topics: "",
    });

    alert("Course added successfully");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Course</h2>

      <div className="space-y-5">
        <input
          name="category"
          placeholder="Category (e.g., Web Development)"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <input
          name="course_name"
          placeholder="Course Name (e.g., React Fundamentals)"
          value={form.course_name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <input
          name="duration_months"
          type="number"
          min="1"
          placeholder="Duration (months)"
          value={form.duration_months}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <input
          name="total_fees"
          type="number"
          min="0"
          placeholder="Total Fees (in ₹ or $)"
          value={form.total_fees}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <input
          name="monthly_fees"
          type="number"
          min="0"
          placeholder="Monthly Fees (in ₹ or $)"
          value={form.monthly_fees}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <textarea
          name="topics"
          placeholder="Topics (comma-separated or brief description)"
          value={form.topics}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out"
      >
        Save Course
      </button>
    </div>
  );
};

export default AddCourse;
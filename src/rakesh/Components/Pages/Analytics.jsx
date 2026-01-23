// import React, { useEffect, useState } from "react";

// /*
//   ===========================
//   📊 Analytics Dashboard
//   Center Established: 2024
//   Purpose:
//   - Show growth & performance of institute
//   - Admin overview (students, courses, revenue, etc.)
//   ===========================
// */

// const Analytics = () => {
//   // ===========================
//   // 📌 State for analytics data
//   // ===========================
//   const [analytics, setAnalytics] = useState({
//     establishedYear: 2024,
//     totalStudents: 0,
//     activeCourses: 0,
//     facultyCount: 0,
//     totalBatches: 0,
//     placementRate: 0,
//   });

//   // ===========================
//   // 📌 Load data (localStorage based)
//   // Future: Replace with API
//   // ===========================
//   useEffect(() => {
//     const students = JSON.parse(localStorage.getItem("students")) || [];
//     const courses = JSON.parse(localStorage.getItem("courses")) || [];

//     setAnalytics({
//       establishedYear: 2024,
//       totalStudents: students.length,
//       activeCourses: courses.length,
//       facultyCount: 6,       // Static for now
//       totalBatches: 12,      // Example value
//       placementRate: 78,     // Percentage
//     });
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* ===========================
//           🏷 Page Heading
//       =========================== */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Institute Analytics
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Performance overview since {analytics.establishedYear}
//         </p>
//       </div>

//       {/* ===========================
//           📊 Analytics Cards
//       =========================== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
//         {/* Total Students */}
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <h3 className="text-sm text-gray-500">Total Students</h3>
//           <p className="text-3xl font-bold text-blue-600 mt-2">
//             {analytics.totalStudents}
//           </p>
//         </div>

//         {/* Active Courses */}
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <h3 className="text-sm text-gray-500">Active Courses</h3>
//           <p className="text-3xl font-bold text-green-600 mt-2">
//             {analytics.activeCourses}
//           </p>
//         </div>

//         {/* Faculty */}
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <h3 className="text-sm text-gray-500">Faculty Members</h3>
//           <p className="text-3xl font-bold text-purple-600 mt-2">
//             {analytics.facultyCount}
//           </p>
//         </div>

//         {/* Batches */}
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <h3 className="text-sm text-gray-500">Total Batches</h3>
//           <p className="text-3xl font-bold text-orange-600 mt-2">
//             {analytics.totalBatches}
//           </p>
//         </div>

//         {/* Placement Rate */}
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <h3 className="text-sm text-gray-500">Placement Rate</h3>
//           <p className="text-3xl font-bold text-emerald-600 mt-2">
//             {analytics.placementRate}%
//           </p>

//           {/* Progress bar */}
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
//             <div
//               className="bg-emerald-500 h-2 rounded-full"
//               style={{ width: `${analytics.placementRate}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Established Year */}
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <h3 className="text-sm text-gray-500">Established</h3>
//           <p className="text-3xl font-bold text-gray-800 mt-2">
//             {analytics.establishedYear}
//           </p>
//         </div>
//       </div>

//       {/* ===========================
//           📈 Future Scope Section
//       =========================== */}
//       <div className="mt-12 bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold text-gray-800 mb-3">
//           Future Analytics
//         </h2>
//         <ul className="list-disc list-inside text-gray-600 space-y-1">
//           <li>Monthly student growth chart</li>
//           <li>Course-wise enrollment analytics</li>
//           <li>Revenue & fee analytics</li>
//           <li>Attendance & performance tracking</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

import React, { useEffect, useState } from "react";

/*
  ===========================
  📊 Analytics Dashboard
  Center Established: 2024
  ===========================
*/

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    establishedYear: 2024,
    totalStudents: 0,
    activeCourses: 0,
    facultyCount: 0,
    totalBatches: 0,
    placementRate: 0,
  });

  // 📈 Graph data (monthly growth – demo data)
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    setAnalytics({
      establishedYear: 2024,
      totalStudents: students.length,
      activeCourses: courses.length,
      facultyCount: 6,
      totalBatches: 12,
      placementRate: 78,
    });

    // 📊 Example growth data (can be API based later)
    setGraphData([
      { month: "Jan", students: 5, courses: 1 },
      { month: "Feb", students: 12, courses: 2 },
      { month: "Mar", students: 25, courses: 3 },
      { month: "Apr", students: 40, courses: 4 },
      { month: "May", students: 60, courses: 5 },
      { month: "Jun", students: students.length, courses: courses.length },
    ]);
  }, []);

  // 📌 SVG graph helpers
  const maxValue = Math.max(
    ...graphData.map((d) => Math.max(d.students, d.courses)),
    10
  );

  const chartHeight = 200;
  const chartWidth = 600;

  const getX = (index) =>
    (index / (graphData.length - 1)) * chartWidth;

  const getY = (value) =>
    chartHeight - (value / maxValue) * chartHeight;

  const studentsPath = graphData
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d.students)}`
    )
    .join(" ");

  const coursesPath = graphData
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d.courses)}`
    )
    .join(" ");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===========================
          Heading
      =========================== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Institute Analytics
        </h1>
        <p className="text-gray-500">
          Performance overview since {analytics.establishedYear}
        </p>
      </div>

      {/* ===========================
          Cards
      =========================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        <StatCard title="Total Students" value={analytics.totalStudents} color="text-blue-600" />
        <StatCard title="Active Courses" value={analytics.activeCourses} color="text-green-600" />
        <StatCard title="Faculty Members" value={analytics.facultyCount} color="text-purple-600" />
        <StatCard title="Total Batches" value={analytics.totalBatches} color="text-orange-600" />
        <StatCard title="Placement Rate" value={`${analytics.placementRate}%`} color="text-emerald-600" />
        <StatCard title="Established" value={analytics.establishedYear} color="text-gray-800" />
      </div>

      {/* ===========================
          📈 Line Graph Section
      =========================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Growth Analytics (2024)
        </h2>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Students Line */}
          <path
            d={studentsPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
          />

          {/* Courses Line */}
          <path
            d={coursesPath}
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
          />

          {/* Data points */}
          {graphData.map((d, i) => (
            <g key={i}>
              <circle
                cx={getX(i)}
                cy={getY(d.students)}
                r="4"
                fill="#2563eb"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.courses)}
                r="4"
                fill="#16a34a"
              />
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 inline-block rounded-full"></span>
            Students
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-600 inline-block rounded-full"></span>
            Courses
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Reusable Stat Card
=========================== */
const StatCard = ({ title, value, color }) => (
  <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default Analytics;


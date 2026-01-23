import React, { useEffect, useState } from "react";
import { MoreVertical, ArrowLeft, ArrowRight } from "lucide-react";

const AllCourses = () => {
  const itemsPerPage = 5;

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openRow, setOpenRow] = useState(null);

  /* 🔹 Load courses from localStorage */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(stored);
  }, []);

  const totalCourses = courses.length;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = courses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        All Courses
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Course Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden lg:table-cell">
                Total Fees
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden xl:table-cell">
                Monthly Fees
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                More
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedCourses.map((course, index) => (
              <React.Fragment key={startIndex + index}>
                {/* MAIN ROW */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {course.category}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {course.course_name}
                  </td>

                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    {course.duration_months} Months
                  </td>

                  <td className="px-4 py-3 text-sm hidden lg:table-cell">
                    ₹{course.total_fees}
                  </td>

                  <td className="px-4 py-3 text-sm hidden xl:table-cell">
                    ₹{course.monthly_fees}
                  </td>

                  {/* MORE BUTTON */}
                  <td className="px-4 py-3 text-sm relative">
                    <button
                      onClick={() =>
                        setOpenRow(
                          openRow === startIndex + index
                            ? null
                            : startIndex + index
                        )
                      }
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>

                {/* MOBILE EXPANDED ROW */}
                {openRow === startIndex + index && (
                  <tr className="bg-gray-50 md:hidden">
                    <td colSpan="7" className="px-4 py-3 text-sm">
                      <div className="space-y-2">
                        <p>
                          <strong>Duration:</strong>{" "}
                          {course.duration_months} Months
                        </p>
                        <p>
                          <strong>Total Fees:</strong> ₹
                          {course.total_fees}
                        </p>
                        <p>
                          <strong>Monthly Fees:</strong> ₹
                          {course.monthly_fees}
                        </p>
                        <p>
                          <strong>Topics:</strong>{" "}
                          {course.topics}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {courses.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500"
                >
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <p className="text-xs text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, totalCourses)} of{" "}
          {totalCourses} courses
        </p>

        <div className="flex items-center space-x-1">
          {/* PREV */}
          <button
            onClick={() => {
              setCurrentPage(Math.max(1, currentPage - 1));
              setOpenRow(null);
            }}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={16} />
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setOpenRow(null);
                }}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            onClick={() => {
              setCurrentPage(
                Math.min(totalPages, currentPage + 1)
              );
              setOpenRow(null);
            }}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;

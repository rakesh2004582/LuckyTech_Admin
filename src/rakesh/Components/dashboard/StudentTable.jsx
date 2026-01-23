import React from "react";
import StatusBadge from "../ui/StatusBadge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { 
  ChevronDown, 
  Filter, 
  Download, 
  MoreVertical,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

const StudentTable = ({
  paginatedStudents,
  selectedStudents,
  toggleSelectAll,
  toggleStudentSelection,
  filterStatus,
  setFilterStatus,
  showFilterMenu,
  setShowFilterMenu,
  sortOption,
  setSortOption,
  handleExportStudents,
  currentPage,
  setCurrentPage,
  sortedStudents,
  itemsPerPage
}) => {
  const navigate = useNavigate();
  const [openActionId, setOpenActionId] = useState(null);
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

 


const handleDeleteStudent = (id) => {
  if (!window.confirm("Are you sure you want to delete this student?")) return;

  const updatedStudents = sortedStudents.filter(
    (student) => student.id !== id
  );

  localStorage.setItem("students", JSON.stringify(updatedStudents));
  window.location.reload(); // simple refresh
};

// const handleUpdateStudent = (id) => {
//   // future edit page
//   window.location.href = `/students/edit/${id}`;
// };

const handleUpdateStudent = (id) => {
  navigate(`/admin/students/edit/${id}`);
};


  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Student Management</h3>
            <p className="text-sm text-gray-500">Manage your student database and enrollment</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              {["all", "active", "inactive", "pending"].map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    filterStatus === status
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}{status !== "all" && " Students"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Filter size={14} className="sm:size-4" />
                  <span>Sort By</span>
                </button>

                {showFilterMenu && (
                  <div
                    className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    onClick={() => setShowFilterMenu(false)}
                  >
                    <ul className="divide-y divide-gray-100 text-sm">
                      {[
                        { id: "name-asc", label: "Name A–Z" },
                        { id: "name-desc", label: "Name Z–A" },
                        { id: "date", label: "Enrollment Date (Oldest First)" },
                        { id: "date-reverse", label: "Enrollment Date (Newest First)" },
                        { id: "course", label: "Course A–Z" }
                      ].map((option) => (
                        <li key={option.id}>
                          <button
                            onClick={() => {
                              setSortOption(option.id);
                              setCurrentPage(1);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100"
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={handleExportStudents}
                className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-100"
              >
                <Download size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Course</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Enrollment Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/40x40/9ca3af/ffffff?text=ST";
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{student.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{student.course}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{student.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{student.enrollmentDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                  {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <MoreVertical size={18} />
                  </td> */}
                  {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 relative">
  <button
    onClick={() =>
      setOpenActionId(
        openActionId === student.id ? null : student.id
      )
    }
    className="p-1 rounded hover:bg-gray-100"
  >
    <MoreVertical size={18} />
  </button>

  {openActionId === student.id && (
    <div className="absolute right-6 top-8 z-50 w-28 bg-white border rounded-md shadow-lg">
      <button
        onClick={() => handleUpdateStudent(student.id)}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
      >
        ✏️ Update
      </button>
      <button
        onClick={() => handleDeleteStudent(student.id)}
        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        🗑 Delete
      </button>
    </div>
  )}
</td> */}
<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 relative">
  <button
    onClick={() =>
      setOpenActionId(openActionId === student.id ? null : student.id)
    }
    className="p-1 rounded hover:bg-gray-100"
  >
    <MoreVertical size={18} />
  </button>

  {openActionId === student.id && (
    <div className="absolute right-8 top-8 z-50 w-32 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col">
      
      {/* Update */}
      <button
        onClick={() => handleUpdateStudent(student.id)}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
      >
        ✏️ Update
      </button>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Delete */}
      <button
        onClick={() => handleDeleteStudent(student.id)}
        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
      >
        🗑 Delete
      </button>
    </div>
  )}
</td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-500">
          Showing{" "}
          {sortedStudents.length === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, sortedStudents.length)}{" "}
          to{" "}
          {Math.min(currentPage * itemsPerPage, sortedStudents.length)}{" "}
          of {sortedStudents.length} results
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-md ${
              currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={14} />
          </button>
          
          {totalPages > 0 && (
            <>
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-2.5 py-1 text-xs rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2.5 py-1 text-xs text-gray-500">...</span>}
                </>
              )}
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                const page = startPage + i;
                
                if (page <= endPage) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 text-xs rounded-md ${
                        currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
              
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2.5 py-1 text-xs text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2.5 py-1 text-xs rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1.5 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
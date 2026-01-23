// import studentsData from "../data/student.json";
// import studentsData from "../../data/student.json";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddStudents from "./AddStudents";  
import {useLocation } from "react-router-dom";
import EditStudent from "./EditStudent";
import AllCourses from "./AllCourse";
import AddAssignment from "./AddAssignment";
import { facultyData } from "../../data/facultyData";

import {
  LayoutDashboard,
  Search,
  Bell,
  Home,
  ChevronRight,
} from "lucide-react";

// Components
// import Sidebar from "../components/layout/Sidebar";
import Sidebar from "../layout/Sidebar";
// import OverviewStats from "../components/dashboard/OverviewStats";
import OverviewStats from "../dashboard/OverviewStats";
// import StudentTable from "../components/dashboard/StudentTable";
import StudentTable from "../dashboard/StudentTable";
// import Toast from "../components/ui/Toast";
import Toast from "../ui/Toast";
// import LogoutModal from "../components/ui/LogoutModal";
import LogoutModal from "../ui/LogoutModal";
import StudentEnrollment from "./StudentEnrollment";
import AddCourse from "./AddCourse";
import StudentAttendance from "./StudentAttendance";
import { Faculty } from "./Faculty";
import Analytics from "./Analytics";
import AcademicCalendar from "./AcademicCalendar";
const AdminDashboard = () => {

  const location = useLocation();


  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [subMenu, setSubMenu] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [students, setStudents] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [coursesOffered, setCoursesOffered] = useState(0);

  const DEFAULT_ADMIN_IMAGE = "https://placehold.co/100x100/9ca3af/ffffff?text=Admin";
  const itemsPerPage = 5;

  useEffect(() => {
    if (!admin) navigate("/admin/login");
  }, [admin, navigate]);

 
useEffect(() => {
  const loadStudents = () => {
    const stored = localStorage.getItem("students");
    setStudents(stored ? JSON.parse(stored) : []);
  };

  loadStudents();
  window.addEventListener("storage", loadStudents);

  return () => window.removeEventListener("storage", loadStudents);
}, []);


// load Courses from localStorage
useEffect(() => {
  const loadCourses = () => {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    setCoursesOffered(courses.length);
  };

  loadCourses(); // 🔥 page load par bhi count set hoga

  window.addEventListener("storage", loadCourses);

  return () => window.removeEventListener("storage", loadCourses);
}, []);

  // Filtering and sorting logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      student.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortOption) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "date": return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
      case "date-reverse": return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
      case "course": return a.course.localeCompare(b.course);
      default: return 0;
    }
  });

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportStudents = () => {
    if (!students.length) return;
    const headers = ["ID", "Name", "Email", "Phone", "Course", "Enrollment Date", "Status"];
    const rows = sortedStudents.map((s) => [
      s.id, s.name, s.email, s.phone, s.course, s.enrollmentDate, s.status
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map((student) => student.id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    toast.success("Logged out successfully");
    setShowLogoutConfirm(false);
    setTimeout(() => navigate("/admin/login"), 1500);
  };


  // count faculty members
  const facultyCount = facultyData.length;

const overviewStats = {
  totalStudents: students.length,
  activeStudents: students.filter((s) => s.status === "Active").length,
  inactiveStudents: students.filter((s) => s.status === "Inactive").length,
  pendingStudents: students.filter((s) => s.status === "Pending").length,
  coursesOffered: coursesOffered,   // ✅ CORRECT
  facultyMembers:  facultyCount,
  avgAttendance: 87.5,
};

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        subMenu={subMenu}
        setSubMenu={setSubMenu}
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 md:hidden"
              >
                <LayoutDashboard size={20} />
              </button>
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search students, courses, or staff..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={admin?.adminImage || DEFAULT_ADMIN_IMAGE}
                  alt={admin?.adminName || "Admin"}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ADMIN_IMAGE;
                  }}
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {admin?.adminName || "Admin User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {admin?.adminRole || "Administrator"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Home size={16} className="mr-2" />
            <span>Home</span>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700">Students</span>
          </div>
        </div>

        {/* <main className="px-4 pb-6 md:px-6">
          <OverviewStats overviewStats={overviewStats} />
          <StudentTable
            paginatedStudents={paginatedStudents}
            selectedStudents={selectedStudents}
            toggleSelectAll={toggleSelectAll}
            toggleStudentSelection={toggleStudentSelection}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            showFilterMenu={showFilterMenu}
            setShowFilterMenu={setShowFilterMenu}
            sortOption={sortOption}
            setSortOption={setSortOption}
            handleExportStudents={handleExportStudents}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            sortedStudents={sortedStudents}
            itemsPerPage={itemsPerPage}
          />
        </main> */}
        {/* <main className="px-4 pb-6 md:px-6">
  {location.pathname === "/students/add" ? (
    <AddStudents />
  ) : (
    <>
      <OverviewStats overviewStats={overviewStats} />
      <StudentTable
        paginatedStudents={paginatedStudents}
        selectedStudents={selectedStudents}
        toggleSelectAll={toggleSelectAll}
        toggleStudentSelection={toggleStudentSelection}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        sortOption={sortOption}
        setSortOption={setSortOption}
        handleExportStudents={handleExportStudents}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortedStudents={sortedStudents}
        itemsPerPage={itemsPerPage}
      />
    </>
  )}
</main> */}
{/* <main className="px-4 pb-6 md:px-6">
  {location.pathname === "/students/add" ? (
    <AddStudents />
  ) : location.pathname.startsWith("/students/edit") ? (
    <EditStudent />
  ) : (
    <>
      <OverviewStats overviewStats={overviewStats} />
      <StudentTable
        paginatedStudents={paginatedStudents}
        selectedStudents={selectedStudents}
        toggleSelectAll={toggleSelectAll}
        toggleStudentSelection={toggleStudentSelection}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        sortOption={sortOption}
        setSortOption={setSortOption}
        handleExportStudents={handleExportStudents}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortedStudents={sortedStudents}
        itemsPerPage={itemsPerPage}
      />
    </>
  )}
</main> */}
<main className="px-4 pb-6 md:px-6">
  {location.pathname === "/admin/students/add" ? (
    <AddStudents />
  ) : location.pathname.startsWith("/admin/students/edit") ? (
    <EditStudent />
  ) : location.pathname === "/admin/courses/all" ? (
    <AllCourses />
  ) : 
  location.pathname==='/admin/students/enrollment' ? (
    <StudentEnrollment />
  ):
  location.pathname === "/admin/courses/add" ? (
    <AddCourse/>
  ) :
  location.pathname === "/admin/courses/assignments" ? (
    <AddAssignment />
  ) :
  location.pathname === "/admin/attendance" ? (
    <StudentAttendance />
  ) :location.pathname === "/admin/faculty" ? (
    <Faculty />
  ) : location.pathname === "/admin/analytics" ? (
    <Analytics />
  ) :
  location.pathname === "/admin/academic-calendar" ? (
    <AcademicCalendar />
  ) : 
   (
    <>
      <OverviewStats overviewStats={overviewStats} />
      <StudentTable
        paginatedStudents={paginatedStudents}
        selectedStudents={selectedStudents}
        toggleSelectAll={toggleSelectAll}
        toggleStudentSelection={toggleStudentSelection}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        sortOption={sortOption}
        setSortOption={setSortOption}
        handleExportStudents={handleExportStudents}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortedStudents={sortedStudents}
        itemsPerPage={itemsPerPage}
      />
    </>
  )}
</main>


      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50"
          >
            <Toast
              message={toastMessage}
              type={toastType}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showLogoutConfirm && (
        <LogoutModal onClose={() => setShowLogoutConfirm(false)} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default AdminDashboard;
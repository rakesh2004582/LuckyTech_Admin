 
import React from "react";
import {
  GraduationCap,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Users,
  Calendar,
  User,
  BookOpen,
  Award,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../../assets/logo.png";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "students",
    label: "Students",
    icon: GraduationCap,
    path: "/admin/students",
    hasSubmenu: true,
    submenu: [
    //   { id: "allStudents", label: "All Students", path: "/students/all" },
    {id: "allStudents", label: "All Students", path: "/admin/dashboard" },
      { id: "addStudent", label: "Add Student", path: "/admin/students/add" },
      { id: "enrollment", label: "Enrollment", path: "/admin/students/enrollment" },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    path: "/admin/courses",
    hasSubmenu: true,
    submenu: [
      { id: "allCourses", label: "All Courses", path: "/admin/courses/all" },
      { id: "addCourse", label: "Add Course", path: "/admin/courses/add" },
      { id: "assignments", label: "Assignments", path: "/admin/courses/assignments" },
    ],
  },
  { id: "attendance", label: "Attendance", icon: Calendar, path: "/admin/attendance" },
  { id: "grades", label: "StudentPerformance", icon: Award, path: "/admin/StudentPerformance" },
  { id: "faculty", label: "Faculty", icon: Users, path: "/admin/faculty" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
  { id: "calendar", label: "Academic Calendar", icon: Calendar, path: "/admin/academic-calendar" }
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
  subMenu,
  setSubMenu,
  showLogoutConfirm,
  setShowLogoutConfirm,
}) => {
  const navigate = useNavigate();

  const toggleSubMenu = (menuId) => {
    setSubMenu((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <aside
      className={`
        bg-white shadow-md fixed md:static z-50 h-full transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-64"}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <GraduationCap className="text-white" size={16} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">StudentMS</h1> */}
          <img src={logo} alt="LuckyTech"  className="w-full h-12"/>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-6 px-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            MAIN MENU
          </h2>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (item.hasSubmenu) {
                        toggleSubMenu(item.id);
                      } else {
                        setActiveMenu(item.id);
                        navigate(item.path);
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeMenu === item.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDown
                        size={16}
                        className={`ml-auto transition-transform ${
                          subMenu[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.hasSubmenu && subMenu[item.id] && (
                    <ul className="mt-1 ml-8 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => {
                              setActiveMenu(subItem.id);
                              navigate(subItem.path);
                              setSidebarOpen(false);
                            }}
                            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              activeMenu === subItem.id
                                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>{subItem.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

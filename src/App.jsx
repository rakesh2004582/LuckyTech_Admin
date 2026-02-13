// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // 🔐 Auth Pages
// import AdminLogin from "./rakesh/Components/AdminLogin";

// // 📊 Dashboard Layout
// import AdminDashboard from "./rakesh/Components/Pages/AdminDashboard";

// // 🔒 Route Guards
// import ProtectedRoute from "./rakesh/Components/ProtectedRoute";
// import LoginRoute from "./rakesh/Components/LoginRoute";
// import AllCourses from "./rakesh/Components/Pages/AllCourse";
// import StudentEnrollment from "./rakesh/Components/Pages/StudentEnrollment";
// import StudentAttendance from "./rakesh/Components/Pages/StudentAttendance";
// import { useEffect } from "react";
// import { initCourses } from "./rakesh/utils/initCourses";
// import { initStudents } from "./rakesh/utils/initStudents";
// import StudentPerformanceDashboard from "./rakesh/Components/Pages/StudentPerformanceDashboard";
// import { useLocation } from 'react-router-dom';
// function App() {
//   // Initialize courses in localStorage on app load
//   useEffect(() => {
//     initCourses(); // load courses once
//   }, []);

// // Initialize students in localStorage on app load
//   useEffect(() => {
//     initStudents(); // load students once
//   }, []);



//   // dynamic routing structure
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname.startsWith('/admin')) {
//       import('./myTailwind.css');
//     } else {
//       import('./index.css');
//     }
//   }, [location.pathname]);




//   return (
//     // 🌐 Enables React Router in the application
//     <BrowserRouter>
//       <Routes>

//         {/* ================= AUTH ROUTES ================= */}

//         {/* 🔐 Admin Login Page
//             - Accessible only when user is NOT logged in
//             - Redirects to dashboard if already logged in */}
//         <Route
//           path="/admin/login"
//           element={
//             <LoginRoute>
//               <AdminLogin />
//             </LoginRoute>
//           }
//         />

//         {/* ================= DASHBOARD ROUTES ================= */}

//         {/* 🔒 Main Admin Dashboard
//             - Protected route (login required)
//             - Default dashboard page */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* ================= STUDENT MANAGEMENT ROUTES ================= */}

//         {/* 📋 View All Students
//             - Uses same AdminDashboard layout
//             - Shows StudentTable component */}
//         <Route
//           path="/admin/students/all"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* ➕ Add New Student
//             - Uses same AdminDashboard layout
//             - Shows AddStudents component */}
//         <Route
//           path="/admin/students/add"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* ✏️ Edit Existing Student
//             - Dynamic route using student ID
//             - Example URL: /students/edit/ST005
//             - Uses same AdminDashboard layout */}
//         <Route
//           path="/admin/students/edit/:id"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
         
//         <Route path="/admin/courses/all" element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
//    <Route
//           path="/admin/students/enrollment"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//           // element={<StudentEnrollment />}
//         />
//         {/* //http://localhost:5173/courses/add  this is the add course route */}
//         <Route
//           path="/admin/courses/add"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//      <Route path="/admin/courses/assignments" element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
     
      
//        <Route path="/admin/attendance" element={
//             <ProtectedRoute>
//               <AdminDashboard />
//               {/* <StudentAttendance /> */}
//             </ProtectedRoute>
//           } />
// <Route path="/admin/faculty" element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />


//           // analytics route
//         <Route
//           path="/admin/analytics"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         // Academic - Calendar Route
//         <Route
//           path="/admin/academic-calendar"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/StudentPerformance"
//           element={
//              <StudentPerformanceDashboard />
//           }
//         />
//         {/* ================= FALLBACK ROUTE ================= */}

//         {/* ❌ 404 Page
//             - Shown when no route matches */}
//         <Route path="*" element={<h1>404 Page Not Found</h1>} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// 🔐 Auth Pages
import AdminLogin from "./rakesh/Components/AdminLogin";

// 📊 Dashboard Layout
import AdminDashboard from "./rakesh/Components/Pages/AdminDashboard";

// 🔒 Route Guards
import ProtectedRoute from "./rakesh/Components/ProtectedRoute";
import LoginRoute from "./rakesh/Components/LoginRoute";
import AllCourses from "./rakesh/Components/Pages/AllCourse";
import StudentEnrollment from "./rakesh/Components/Pages/StudentEnrollment";
import StudentAttendance from "./rakesh/Components/Pages/StudentAttendance";
import { initCourses } from "./rakesh/utils/initCourses";
import { initStudents } from "./rakesh/utils/initStudents";
import StudentPerformanceDashboard from "./rakesh/Components/Pages/StudentPerformanceDashboard";

// Separate component for routes that needs useLocation
function AppRoutes() {
  const location = useLocation();

  // Initialize courses in localStorage on app load
  useEffect(() => {
    initCourses(); // load courses once
  }, []);

  // Initialize students in localStorage on app load
  useEffect(() => {
    initStudents(); // load students once
  }, []);

  // Dynamic CSS import based on route
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      import('./myTailwind.css');
    } else {
      import('./index.css');
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}

      {/* 🔐 Admin Login Page */}
      <Route
        path="/admin/login"
        element={
          <LoginRoute>
            <AdminLogin />
          </LoginRoute>
        }
      />

      {/* ================= DASHBOARD ROUTES ================= */}

      {/* 🔒 Main Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= STUDENT MANAGEMENT ROUTES ================= */}

      {/* 📋 View All Students */}
      <Route
        path="/admin/students/all"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ➕ Add New Student */}
      <Route
        path="/admin/students/add"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✏️ Edit Existing Student */}
      <Route
        path="/admin/students/edit/:id"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/all"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/enrollment"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/add"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/assignments"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Analytics route */}
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Academic - Calendar Route */}
      <Route
        path="/admin/academic-calendar"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/StudentPerformance"
        element={<StudentPerformanceDashboard />}
      />

      {/* ================= FALLBACK ROUTE ================= */}

      {/* ❌ 404 Page */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

function App() {
  return (
    // 🌐 Enables React Router in the application
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
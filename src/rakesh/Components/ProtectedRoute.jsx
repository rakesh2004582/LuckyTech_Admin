import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");

  // ❌ not logged in → login page
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ logged in → allow access
  return children;
};

export default ProtectedRoute;

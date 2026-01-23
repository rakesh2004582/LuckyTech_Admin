import React from "react";
import { Navigate } from "react-router-dom";

const LoginRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");

  // ✅ already logged in → dashboard
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default LoginRoute;

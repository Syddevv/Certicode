import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setupAutoLogout } from "../utils/autoLogout";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
  //   if (userRole === "Admin") {
  //     return <Navigate to="/dashboard" replace />;
  //   }
  //   return <Navigate to="/" replace />;
  // }

  // useEffect(() => {
  //   const handleLogout = () => {
  //     api.clearAuthData();
  //     navigate("/login?message=Logged out due to inactivity");
  //   };

  //   const cleanup = setupAutoLogout(handleLogout, 60);

  //   return cleanup;
  // }, [navigate]);

  return children;
};

export default ProtectedRoute;

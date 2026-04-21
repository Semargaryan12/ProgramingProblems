import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 1. Եթե օգտատերը մուտք չի գործել
  if (!role) {
    return <Navigate to="/login" />;
  }

  // 2. SuperAdmin-ը պետք է հասանելիություն ունենա ԱՄԵՆ ԻՆՉԻՆ
  if (role === "superadmin") {
    return element;
  }

  // 3. Եթե դերը չի համապատասխանում պահանջվողին
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;

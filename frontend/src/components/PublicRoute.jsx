import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const auth = JSON.parse(localStorage.getItem("auth_v1"));
  if (auth) return <Navigate to="/home" replace />;
  return children;
}

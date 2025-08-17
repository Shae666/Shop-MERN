import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // check if user is logged in (auth saved in localStorage)
  const auth = JSON.parse(localStorage.getItem("auth_v1"));

  if (!auth) {
    // if no login data → redirect to SignIn page ("/")
    return <Navigate to="/" replace />;
  }

  // if logged in → allow access
  return children;
}

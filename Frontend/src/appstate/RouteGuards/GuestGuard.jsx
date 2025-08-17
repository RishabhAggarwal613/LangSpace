import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function GuestGuard({ children }) {
  const { user } = useSelector((s) => s.auth);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

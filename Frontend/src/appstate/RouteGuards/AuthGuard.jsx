import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthGuard({ children }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout.jsx";
import PrivateLayout from "../components/layout/PrivateLayout.jsx";

import AuthGuard from "../appstate/RouteGuards/AuthGuard.jsx";
import GuestGuard from "../appstate/RouteGuards/GuestGuard.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const AiChat = lazy(() => import("../pages/AiChat.jsx"));
const AiTutor = lazy(() => import("../pages/AiTutor.jsx"));
const AiPractice = lazy(() => import("../pages/AiPractice.jsx"));
const AiGame = lazy(() => import("../pages/AiGame.jsx"));
const Login = lazy(() => import("../auth/Login.jsx"));
const Signup = lazy(() => import("../auth/Signup.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route
          path="auth/login"
          element={
            <GuestGuard>
              <Login />
            </GuestGuard>
          }
        />
        <Route
          path="auth/signup"
          element={
            <GuestGuard>
              <Signup />
            </GuestGuard>
          }
        />
      </Route>

      <Route
        element={
          <AuthGuard>
            <PrivateLayout />
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ai-chat" element={<AiChat />} />
        <Route path="ai-tutor" element={<AiTutor />} />
        <Route path="ai-practice" element={<AiPractice />} />
        <Route path="ai-game" element={<AiGame />} />
      </Route>

      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PrivateLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

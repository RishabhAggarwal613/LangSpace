// src/components/layout/PrivateLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function ScrollFix() {
  const { pathname } = useLocation();

  // Disable browser's history scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => { window.history.scrollRestoration = prev; };
    }
  }, []);

  // Jump to top instantly on route change
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    el.style.scrollBehavior = prev || "";
  }, [pathname]);

  return null;
}

export default function PrivateLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />
      <ScrollFix />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "../auth/UserMenu.jsx";
import SkipLink from "../ui/SkipLink.jsx";

const navItems = [
  { to: "/ai-chat", label: "AI Chat" },
  { to: "/ai-tutor", label: "AI Tutor" },
  { to: "/ai-practice", label: "AI Practice" },
  { to: "/ai-game", label: "AI Game" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const linkClasses = useMemo(
    () =>
      ({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm ${
          isActive ? "font-semibold" : "opacity-80 hover:opacity-100"
        }`,
    []
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
      <SkipLink />
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.svg"
              alt="LangSpace"
              className="h-8 w-8 rounded-lg"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="text-lg font-bold tracking-tight">LangSpace</span>
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-2"
            aria-expanded={open}
            aria-controls="primary-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              <li key={it.to}>
                <NavLink to={it.to} className={linkClasses}>
                  {it.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-3 py-2 text-sm rounded-xl border"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-3 py-2 text-sm rounded-xl"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="primary-menu"
          className={`md:hidden overflow-hidden transition-[max-height] ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <ul className="py-2 border-t">
            {navItems.map((it) => (
              <li key={it.to}>
                <NavLink to={it.to} className="block px-3 py-2">
                  {it.label}
                </NavLink>
              </li>
            ))}
            {!user && (
              <li className="flex gap-2 px-3 py-2">
                <Link to="/auth/login" className="px-3 py-2 rounded-xl border text-sm">
                  Log in
                </Link>
                <Link to="/auth/signup" className="px-3 py-2 rounded-xl text-sm">
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

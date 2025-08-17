import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "../auth/UserMenu.jsx";
import SkipLink from "../ui/SkipLink.jsx";

const navItems = [
  { to: "/ai-chat", label: "Conversation Practice" },
  { to: "/ai-tutor", label: "Language Coach" },
  { to: "/ai-practice", label: "Language Practice" },
  { to: "/ai-game", label: "Grammer Game" },
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
        [
          "px-3 py-2 rounded-xl text-sm transition-colors duration-200",
          isActive
            ? "text-white bg-orange-500/20 border border-orange-400/30"
            : "text-neutral-300 hover:text-white hover:bg-white/5",
        ].join(" "),
    []
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/70 border-b border-white/10 text-neutral-100">
      <SkipLink />
      {/* orange accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.svg"
              alt="LangSpace"
              className="h-8 w-8 rounded-lg ring-1 ring-white/10"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              LangSpace
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((it) => (
              <li key={it.to}>
                <NavLink to={it.to} className={linkClasses}>
                  {it.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth area */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-3 py-2 text-sm rounded-xl border border-white/15 text-neutral-200 hover:text-white hover:bg-white/5"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-3 py-2 text-sm rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-2 text-neutral-200 hover:text-white hover:bg-white/5"
            aria-expanded={open}
            aria-controls="primary-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="primary-menu"
          className={`md:hidden overflow-hidden transition-[max-height] ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="py-2 border-t border-white/10 bg-neutral-950/80">
            <ul>
              {navItems.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    className={({ isActive }) =>
                      [
                        "block px-3 py-2 rounded-xl",
                        isActive
                          ? "text-white bg-orange-500/20 border border-orange-400/30"
                          : "text-neutral-300 hover:text-white hover:bg-white/5",
                      ].join(" ")
                    }
                  >
                    {it.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {!user && (
              <div className="flex gap-2 px-3 py-2">
                <Link
                  to="/auth/login"
                  className="px-3 py-2 rounded-xl text-sm border border-white/15 text-neutral-200 hover:text-white hover:bg-white/5"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-3 py-2 rounded-xl text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

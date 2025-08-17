import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "../auth/UserMenu.jsx";
import SkipLink from "../ui/SkipLink.jsx";

const navItems = [
  { to: "/ai-chat", label: "Conversation Practice" },
  { to: "/ai-tutor", label: "Language Coach" },
  { to: "/ai-practice", label: "Language Practice" },
  { to: "/ai-game", label: "Grammer Game" }, // keep product copy
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClasses = useMemo(
    () =>
      ({ isActive }) =>
        [
          "relative px-3 py-2 rounded-xl text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 border",
          isActive
            ? "text-white bg-orange-500/20 border-orange-400/30"
            : "text-neutral-300 hover:text-white hover:bg-white/5 border-transparent",
        ].join(" "),
    []
  );

  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/70 border-b border-white/10 text-neutral-100",
        scrolled ? "shadow-lg shadow-black/20" : "",
      ].join(" ")}
    >
      <SkipLink />
      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />

      <nav className="max-w-7xl mx-auto px-3 sm:px-4" aria-label="Primary">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="LangSpace Home">
            <img
              src="/logo.svg"
              alt=""
              className="h-8 w-8 rounded-lg ring-1 ring-white/10"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              LangSpace
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="relative hidden md:flex items-center gap-1 ml-2">
            {navItems.map((it) => (
              <li key={it.to} className="relative">
                <NavLink to={it.to} className={linkClasses}>
                  {({ isActive }) => (
                    <>
                      <span>{it.label}</span>
                      <span
                        aria-hidden
                        className={[
                          "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-opacity",
                          isActive ? "opacity-100" : "opacity-0",
                        ].join(" ")}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-3 py-2 text-sm rounded-xl border border-white/15 text-neutral-200 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-3 py-2 text-sm rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-2 text-neutral-200 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
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

        {/* Mobile overlay */}
        {open && (
          <button
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 md:hidden bg-black/40"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Mobile menu */}
        <div
          id="primary-menu"
          className={`md:hidden overflow-hidden transition-[max-height,opacity,transform] duration-300 ${
            open ? "max-h-[80vh] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
          }`}
        >
          <div
            className={[
              "relative py-2 border-t border-white/10 rounded-b-2xl shadow-2xl",
              // NEW: subtle tinted gradient with strong contrast
              "bg-gradient-to-b from-neutral-950/95 via-neutral-900/95 to-neutral-950/95 backdrop-blur",
            ].join(" ")}
          >
            {/* decorative glow */}
            <span className="pointer-events-none absolute -top-6 right-6 h-16 w-16 rounded-full bg-gradient-to-tr from-orange-600/20 to-amber-400/20 blur-2xl" />

            <ul className="px-2">
              {navItems.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    className={({ isActive }) =>
                      [
                        "block px-3 py-2 rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70",
                        isActive
                          ? // NEW: clearer active state with tinted pill
                            "text-white bg-gradient-to-r from-orange-600/25 to-amber-500/20 border-orange-400/30"
                          : // NEW: brighter default text & hover for contrast
                            "text-neutral-200 hover:text-white hover:bg-white/10 border-transparent",
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
                  className="px-3 py-2 rounded-xl text-sm border border-white/15 text-neutral-200 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 flex-1 text-center"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-3 py-2 rounded-xl text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 flex-1 text-center"
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

// src/components/auth/UserMenu.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { Link } from "react-router-dom";

function useOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside?.();
    }
    document.addEventListener("mousedown", handle, { passive: true });
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

export default function UserMenu() {
  const { user } = useSelector((s) => s.auth) || {};
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const itemsRef = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);
  useOutside(menuRef, () => setOpen(false));

  const initials = useMemo(() => {
    const name = user?.name?.trim() || "User";
    return name
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "U";
  }, [user?.name]);

  const menuId = "user-menu";

  // Close on Esc and trap simple arrow nav when open
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => {
          const next = (i + 1) % itemsRef.current.length;
          itemsRef.current[next]?.focus();
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => {
          const next = (i - 1 + itemsRef.current.length) % itemsRef.current.length;
          itemsRef.current[next]?.focus();
          return next;
        });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first item when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        itemsRef.current[0]?.focus();
        setActiveIdx(0);
      }, 0);
    }
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/15 px-2 py-1.5 text-neutral-200 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user?.name ? `${user.name} avatar` : "User avatar"}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full grid place-items-center border border-white/15 text-xs text-neutral-100 bg-white/5">
            {initials}
          </div>
        )}
        <span className="text-sm max-sm:hidden">{user?.name || "User"}</span>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-transform opacity-70 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <>
          {/* click-away overlay on mobile */}
          <button
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 md:hidden bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-900/95 backdrop-blur ring-1 ring-white/10 text-neutral-100 shadow-2xl p-1 z-50 origin-top-right animate-in fade-in-0 zoom-in-95"
          >
            <Link
              to="/dashboard"
              role="menuitem"
              ref={(el) => (itemsRef.current[0] = el)}
              className="block px-3 py-2 rounded-xl text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>

            <button
              type="button"
              role="menuitem"
              ref={(el) => (itemsRef.current[1] = el)}
              className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
              onClick={() => {
                setOpen(false);
                dispatch(logout());
              }}
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}


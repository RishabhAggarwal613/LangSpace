import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { Link } from "react-router-dom";

function useOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside?.();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

export default function UserMenu() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));

  const initials =
    user?.name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border px-2 py-1.5"
        aria-expanded={open}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name || "User"} className="w-7 h-7 rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full grid place-items-center border text-xs">
            {initials}
          </div>
        )}
        <span className="text-sm max-sm:hidden">{user?.name || "User"}</span>
        <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-70">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white shadow-xl p-1">
          <Link to="/dashboard" className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5">
            Dashboard
          </Link>
          <Link to="/ai-chat" className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5">
            AI Chat
          </Link>
          <Link to="/ai-practice" className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5">
            AI Practice
          </Link>
          <button
            className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-black/5"
            onClick={() => dispatch(logout())}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

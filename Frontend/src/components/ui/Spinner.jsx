import React from "react";

export default function Spinner({ size = 20, className = "", label }) {
  const px = typeof size === "number" ? `${size}px` : size;
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <svg viewBox="0 0 24 24" style={{ width: px, height: px }} className="animate-spin">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.2" />
        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
      {label && <span className="text-sm opacity-80">{label}</span>}
    </div>
  );
}

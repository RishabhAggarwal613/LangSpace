import React from "react";

export default function FullScreenLoader({ label = "Loading…" }) {
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 grid place-items-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-current border-t-transparent animate-spin" />
        <span className="text-sm opacity-80">{label}</span>
      </div>
    </div>
  );
}

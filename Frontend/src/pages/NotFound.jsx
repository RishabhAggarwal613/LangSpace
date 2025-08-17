import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold">404 — Page not found</h1>
        <p className="mt-2 opacity-80">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 rounded-xl border">Go Home</Link>
      </div>
    </div>
  );
}

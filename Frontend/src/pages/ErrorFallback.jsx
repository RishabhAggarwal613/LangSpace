import React from "react";

export default function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm opacity-80">
          An unexpected error occurred. You can refresh the page or go back home.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-xl border text-sm"
            onClick={() => location.reload()}
          >
            Refresh
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-xl text-sm"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

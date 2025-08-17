import React from "react";

export default function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-xl focus:border focus:bg-white"
    >
      Skip to content
    </a>
  );
}

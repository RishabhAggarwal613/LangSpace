import React from "react";

export default function VisuallyHidden({ as: Comp = "span", className = "", ...props }) {
  return (
    <Comp
      className={`sr-only ${className}`}
      {...props}
    />
  );
}

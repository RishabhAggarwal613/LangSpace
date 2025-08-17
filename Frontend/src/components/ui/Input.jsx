import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className = "", id, ...props },
  ref
) {
  const inputId = id || `i-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Input;

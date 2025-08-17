import React from "react";

const base =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition focus:outline-none focus-visible:ring";

const variants = {
  solid: "bg-black text-white hover:opacity-90",
  outline: "border hover:bg-black/5",
  ghost: "hover:bg-black/5",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  as: Comp = "button",
  variant = "solid",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <Comp className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}

import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "action" | "icon";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};

const variantClasses = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 w-65",
  danger: "bg-red-600 text-white hover:bg-red-700",
  action: "bg-gray-600 text-white hover:bg-gray-700 min-w-24",
  icon: "max-w-20 bg-gray-200",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "px-4 py-2 rounded-md font-medium transition flex items-center justify-center gap-2",
        variantClasses[variant],
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {loading && <span className="loader"></span>}
      {loading ? "Loading..." : children}
    </button>
  );
};

import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      outline: "border border-gray-300 hover:bg-gray-50",
    };

    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

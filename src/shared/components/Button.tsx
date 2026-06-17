import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../utils/classNames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "icon" | "danger";
  children: ReactNode;
};

export function Button({ variant = "ghost", className, children, ...props }: ButtonProps) {
  const mapped = variant === "primary" ? "primary-button" : variant === "icon" ? "icon-button" : "icon-text";
  return (
    <button className={classNames(mapped, variant === "danger" && "danger", className)} {...props}>
      {children}
    </button>
  );
}

import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, ...props }: InputProps) {
  if (!label) return <input {...props} />;
  return (
    <label>
      {label}
      <input {...props} />
    </label>
  );
}

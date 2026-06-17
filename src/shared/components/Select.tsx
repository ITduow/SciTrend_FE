import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Array<{ label: string; value: string }>;
};

export function Select({ label, options, ...props }: SelectProps) {
  const control = (
    <select {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  return label ? <label>{label}{control}</label> : control;
}

export const isRequired = (value: unknown) => value !== null && value !== undefined && value !== "";
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

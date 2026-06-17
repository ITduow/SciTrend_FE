export function formatDate(value?: string | null) {
  if (!value) return "None";
  return new Date(value).toLocaleString();
}

export function useQueryParams() {
  return new URLSearchParams(window.location.search);
}

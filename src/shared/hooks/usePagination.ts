import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../../config/constants";

export function usePagination(initialSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  return { page, size, setPage, setSize, reset: () => setPage(1) };
}

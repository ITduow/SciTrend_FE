export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
};

export type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
};

export type Paged<T> = {
  items: T[];
  pagination: Pagination;
};

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

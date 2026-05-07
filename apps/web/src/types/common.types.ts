export type Nullable<T> = T | null;

export interface SelectOption {
  value: string;
  label: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

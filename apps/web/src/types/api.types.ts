export interface ApiError {
  message: string;
  code?: string;
}

export interface ApiResponse<TData> {
  data: TData;
  errors?: ApiError[];
}

export interface GraphQLError {
  message: string;
  locations?: unknown;
  path?: unknown;
}

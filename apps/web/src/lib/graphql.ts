import { apiClient } from "./axios";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: unknown; path?: unknown }>;
}

export const gqlQuery = async <T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const response = await apiClient.post<GraphQLResponse<T>>("/graphql", {
    query,
    variables,
  });

  const { data, errors } = response.data;

  if (errors && errors.length > 0) {
    const message = errors.map((e) => e.message).join("; ");
    throw new Error(`GraphQL error: ${message}`);
  }

  if (data === undefined) {
    throw new Error("GraphQL response has no data");
  }

  return data;
};

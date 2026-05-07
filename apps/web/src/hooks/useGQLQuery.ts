import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { gqlQuery } from "@/lib/graphql";

export const useGQLQuery = <T = unknown>(
  queryKey: readonly unknown[],
  gql: string,
  variables?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) => {
  return useQuery<T>({
    queryKey: queryKey as unknown[],
    queryFn: () => gqlQuery<T>(gql, variables),
    staleTime: 60000,
    ...options,
  });
};

export const env = {
  apiUrl: process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001",
  trpcUrl:
    process.env["NEXT_PUBLIC_TRPC_URL"] ?? "http://localhost:3001/api/trpc",
  graphqlUrl:
    process.env["NEXT_PUBLIC_GRAPHQL_URL"] ??
    "http://localhost:3001/api/graphql",
} as const;

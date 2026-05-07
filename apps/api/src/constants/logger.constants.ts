export const LOG_EVENTS = {
  ENV_INVALID: "env.invalid",
  DB_POOL_ERROR: "db.pool.error",
  TRPC_INTERNAL_ERROR: "trpc.internal.error",
  GRAPHQL_PROMPT_QUERY_FAILED: "graphql.query.prompt.failed",
  GRAPHQL_PROMPT_VERSIONS_QUERY_FAILED: "graphql.query.promptVersions.failed",
} as const;
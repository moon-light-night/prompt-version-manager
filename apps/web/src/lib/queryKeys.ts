export const queryKeys = {
  prompts: {
    all: ["prompts"] as const,
    list: (filters: Record<string, unknown>) => ["prompts", "list", filters] as const,
    detail: (id: string) => ["prompts", id] as const,
  },
  tags: {
    all: ["tags"] as const,
    list: () => ["tags", "list"] as const,
    byPrompt: (promptId: string) => ["tags", "prompt", promptId] as const,
  },
  versions: {
    all: ["versions"] as const,
    list: (promptId: string) => ["versions", "list", promptId] as const,
    detail: (id: string) => ["versions", id] as const,
    compare: (idA: string, idB: string) => ["versions", "compare", idA, idB] as const,
  },
  testCases: {
    all: ["testCases"] as const,
    list: (promptId: string) => ["testCases", "list", promptId] as const,
    detail: (id: string) => ["testCases", id] as const,
  },
  promptRuns: {
    all: ["promptRuns"] as const,
    listByPrompt: (promptId: string) => ["promptRuns", "byPrompt", promptId] as const,
    listByVersion: (versionId: string) => ["promptRuns", "byVersion", versionId] as const,
    listByTestCase: (testCaseId: string) => ["promptRuns", "byTestCase", testCaseId] as const,
    detail: (id: string) => ["promptRuns", id] as const,
  },
  dashboard: {
    summary: () => ["dashboard", "summary"] as const,
  },
  graphql: {
    prompts: (vars: Record<string, unknown>) => ["gql", "prompts", vars] as const,
    tags: () => ["gql", "tags"] as const,
    dashboardSummary: () => ["gql", "dashboard", "summary"] as const,
  },
} as const;

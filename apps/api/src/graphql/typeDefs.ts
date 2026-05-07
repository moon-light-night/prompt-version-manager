export const typeDefs = `
  """Active/archived lifecycle status of a prompt."""
  enum PromptStatus {
    active
    archived
  }

  type Prompt {
    id: ID!
    title: String!
    description: String
    status: PromptStatus!
    createdAt: String!
    updatedAt: String!
    versionCount: Int!
    testCaseCount: Int!
    latestVersion: PromptVersion
    tags: [Tag!]!
  }

  type PromptVersion {
    id: ID!
    promptId: ID!
    versionNumber: Int!
    content: String!
    variables: [String!]!
    label: String
    createdAt: String!
  }

  type Tag {
    id: ID!
    name: String!
    color: String
    createdAt: String!
  }

  type PaginatedPrompts {
    items: [Prompt!]!
    total: Int!
    limit: Int!
    offset: Int!
  }

  """Summary statistics for the dashboard."""
  type DashboardSummary {
    totalPrompts: Int!
    activePrompts: Int!
    archivedPrompts: Int!
    totalVersions: Int!
    totalTestCases: Int!
    totalRuns: Int!
    recentPrompts: [Prompt!]!
    recentRuns: [RecentRun!]!
  }

  """A recent run with denormalized context."""
  type RecentRun {
    id: ID!
    testCaseId: ID!
    testCaseName: String!
    versionId: ID!
    versionNumber: Int!
    promptId: ID!
    promptTitle: String!
    score: Int
    actualOutput: String!
    ranAt: String!
  }

  type Query {
    """List prompts with optional filters, sort, and pagination."""
    prompts(
      status: PromptStatus
      search: String
      tagIds: [ID!]
      sort: String
      limit: Int
      offset: Int
    ): PaginatedPrompts!

    """Get a single prompt by ID (includes tags)."""
    prompt(id: ID!): Prompt

    """List all versions for a given prompt."""
    promptVersions(promptId: ID!): [PromptVersion!]!

    """List all tags."""
    tags: [Tag!]!

    """Dashboard summary statistics and recent activity."""
    dashboardSummary: DashboardSummary!
  }
`;

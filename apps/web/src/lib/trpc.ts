import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type {
  Prompt,
  PromptWithMeta,
  PaginatedResult,
  Tag,
  PromptVersion,
  VersionCompareResult,
  PromptTestCase,
  PromptRun,
  PromptSort,
} from "@pvm/shared";

interface Query<TInput, TOutput> {
  query(input: TInput): Promise<TOutput>;
}
interface QueryNoInput<TOutput> {
  query(): Promise<TOutput>;
}
interface Mutation<TInput, TOutput> {
  mutate(input: TInput): Promise<TOutput>;
}
interface MutationNoInput<TOutput> {
  mutate(): Promise<TOutput>;
}

export interface ListPromptsInput {
  status?: "active" | "archived";
  search?: string;
  tagIds?: string[];
  sort?: PromptSort;
  limit?: number;
  offset?: number;
}

export interface CreatePromptInput {
  title: string;
  description?: string | null;
}

export interface UpdatePromptInput {
  id: string;
  title?: string;
  description?: string | null;
}

export interface CreateVersionInput {
  promptId: string;
  content: string;
  label?: string | null;
}

export interface CreateTestCaseInput {
  promptId: string;
  name: string;
  inputValues?: Record<string, string>;
  expectedOutput?: string | null;
}

export interface UpdateTestCaseInput {
  id: string;
  name?: string;
  inputValues?: Record<string, string>;
  expectedOutput?: string | null;
  status?: "active" | "archived";
}

export interface CreateRunInput {
  testCaseId: string;
  versionId: string;
  actualOutput: string;
  score?: number | null;
  notes?: string | null;
  latencyMs?: number | null;
  model?: string | null;
}

export interface DashboardRecentRun {
  id: string;
  testCaseId: string;
  testCaseName: string;
  versionId: string;
  versionNumber: number;
  promptId: string;
  promptTitle: string;
  score: number | null;
  actualOutput: string;
  ranAt: string;
}

export interface DashboardSummary {
  totalPrompts: number;
  activePrompts: number;
  archivedPrompts: number;
  totalVersions: number;
  totalTestCases: number;
  totalRuns: number;
  recentPrompts: PromptWithMeta[];
  recentRuns: DashboardRecentRun[];
}

export interface TypedTRPCClient {
  prompt: {
    list: Query<ListPromptsInput, PaginatedResult<PromptWithMeta>>;
    byId: Query<{ id: string }, PromptWithMeta>;
    create: Mutation<CreatePromptInput, Prompt>;
    update: Mutation<UpdatePromptInput, Prompt>;
    archive: Mutation<{ id: string }, Prompt>;
  };
  promptVersion: {
    listByPrompt: Query<{ promptId: string }, PromptVersion[]>;
    byId: Query<{ id: string }, PromptVersion>;
    compare: Query<{ versionAId: string; versionBId: string }, VersionCompareResult>;
    create: Mutation<CreateVersionInput, PromptVersion>;
  };
  tag: {
    list: QueryNoInput<Tag[]>;
    getByPrompt: Query<{ promptId: string }, Tag[]>;
    create: Mutation<{ name: string; color?: string | null }, Tag>;
    attach: Mutation<{ promptId: string; tagId: string }, void>;
    detach: Mutation<{ promptId: string; tagId: string }, void>;
  };
  testCase: {
    listByPrompt: Query<{ promptId: string; includeArchived?: boolean }, PromptTestCase[]>;
    byId: Query<{ id: string }, PromptTestCase>;
    create: Mutation<CreateTestCaseInput, PromptTestCase>;
    update: Mutation<UpdateTestCaseInput, PromptTestCase>;
    delete: Mutation<{ id: string }, { success: boolean }>;
  };
  promptRun: {
    listByPrompt: Query<{ promptId: string }, PromptRun[]>;
    listByVersion: Query<{ versionId: string }, PromptRun[]>;
    listByTestCase: Query<{ testCaseId: string }, PromptRun[]>;
    byId: Query<{ id: string }, PromptRun>;
    create: Mutation<CreateRunInput, PromptRun>;
  };
  dashboard: {
    summary: QueryNoInput<DashboardSummary>;
  };
}

const buildTRPCClient = (): TypedTRPCClient => {
  const raw = createTRPCClient<any>({
    links: [httpBatchLink({ url: "/api/trpc" })],
  });
  return raw as unknown as TypedTRPCClient;
};

export const trpcClient: TypedTRPCClient = buildTRPCClient();


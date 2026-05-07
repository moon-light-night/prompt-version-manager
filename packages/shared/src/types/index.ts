import type { DiffResult } from "../utils/diff.js";

export type { DiffResult, DiffLine, DiffLineType } from "../utils/diff.js";

export type PromptSort =
  | "updated_desc"
  | "updated_asc"
  | "title_asc"
  | "title_desc"
  | "created_desc";

export type PromptStatus = "active" | "archived";

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  status: PromptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PromptWithMeta extends Prompt {
  latestVersion: PromptVersion | null;
  versionCount: number;
  testCaseCount: number;
  tags: Tag[];
}

export interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  variables: string[];
  label: string | null;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
}

export type PromptTestCaseStatus = "active" | "archived";

export interface PromptTestCase {
  id: string;
  promptId: string;
  name: string;
  inputValues: Record<string, string>;
  expectedOutput: string | null;
  status: PromptTestCaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTestCaseWithMeta extends PromptTestCase {
  runsCount: number;
}

export type PromptRunScore = 1 | 2 | 3 | 4 | 5;
export type PromptRunStatus = "completed" | "error";

export interface PromptRun {
  id: string;
  testCaseId: string;
  versionId: string;
  actualOutput: string;
  score: PromptRunScore | null;
  notes: string | null;
  latencyMs: number | null;
  model: string | null;
  status: PromptRunStatus;
  ranAt: string;
}

export interface PromptRunWithVersion extends PromptRun {
  version: Pick<PromptVersion, "id" | "versionNumber">;
}

export interface VersionCompareResult {
  versionA: PromptVersion;
  versionB: PromptVersion;
  diff: DiffResult;
  addedVariables: string[];
  removedVariables: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

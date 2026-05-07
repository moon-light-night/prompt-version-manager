import { TRPCError } from "@trpc/server";
import type { PromptRunRepository } from "@/repositories/promptRunRepository";
import type { TestCaseRepository } from "@/repositories/testCaseRepository";
import type { VersionRepository } from "@/repositories/versionRepository";
import type { PromptRun } from "@pvm/shared";
import type { CreateRunInputType } from "@/schemas/promptRunSchemas";
import {
  PROMPT_RUN_DEFAULT_LIMIT_BY_PROMPT,
  PROMPT_RUN_DEFAULT_LIMIT_BY_TEST_CASE,
  PROMPT_RUN_DEFAULT_LIMIT_BY_VERSION,
  PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
} from "@/constants/promptRun.constants";

export function createPromptRunService(
  runRepo: PromptRunRepository,
  testCaseRepo: TestCaseRepository,
  versionRepo: VersionRepository,
) {
  return {
    async listByPrompt(
      promptId: string,
      limit = PROMPT_RUN_DEFAULT_LIMIT_BY_PROMPT,
      offset = PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
    ): Promise<PromptRun[]> {
      return runRepo.findByPromptId(promptId, limit, offset);
    },

    async listByTestCase(
      testCaseId: string,
      limit = PROMPT_RUN_DEFAULT_LIMIT_BY_TEST_CASE,
      offset = PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
    ): Promise<PromptRun[]> {
      return runRepo.findByTestCaseId(testCaseId, limit, offset);
    },

    async listByVersion(
      versionId: string,
      limit = PROMPT_RUN_DEFAULT_LIMIT_BY_VERSION,
      offset = PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
    ): Promise<PromptRun[]> {
      const version = await versionRepo.findById(versionId);
      if (!version) {
        throw new TRPCError({ code: "NOT_FOUND", message: `Version ${versionId} not found` });
      }
      return runRepo.findByVersionId(versionId, limit, offset);
    },

    async getById(id: string): Promise<PromptRun> {
      const run = await runRepo.findById(id);
      if (!run) {
        throw new TRPCError({ code: "NOT_FOUND", message: `Run ${id} not found` });
      }
      return run;
    },

    async create(data: CreateRunInputType): Promise<PromptRun> {
      const [testCase, version] = await Promise.all([
        testCaseRepo.findById(data.testCaseId),
        versionRepo.findById(data.versionId),
      ]);

      if (!testCase) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Test case ${data.testCaseId} not found`,
        });
      }
      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Version ${data.versionId} not found`,
        });
      }

      return runRepo.create({
        testCaseId: data.testCaseId,
        versionId: data.versionId,
        actualOutput: data.actualOutput,
        score: data.score ?? null,
        notes: data.notes ?? null,
      });
    },
  };
}

export type PromptRunService = ReturnType<typeof createPromptRunService>;

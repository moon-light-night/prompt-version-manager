import type { TestCaseRepository } from "@/repositories/testCaseRepository";
import type { PromptRepository } from "@/repositories/promptRepository";
import type { PromptTestCase } from "@pvm/shared";
import type {
  CreateTestCaseInputType,
  UpdateTestCaseInputType,
} from "@/schemas/testCaseSchemas";
import { notFoundByIdError } from "./serviceErrors";

export function createTestCaseService(
  testCaseRepo: TestCaseRepository,
  promptRepo: PromptRepository,
) {
  return {
    async listByPrompt(
      promptId: string,
      includeArchived = false,
    ): Promise<PromptTestCase[]> {
      const prompt = await promptRepo.findById(promptId);
      if (!prompt) {
        throw notFoundByIdError("Prompt", promptId);
      }
      return testCaseRepo.findByPromptId(promptId, includeArchived);
    },

    async getById(id: string): Promise<PromptTestCase> {
      const tc = await testCaseRepo.findById(id);
      if (!tc) {
        throw notFoundByIdError("Test case", id);
      }
      return tc;
    },

    async create(data: CreateTestCaseInputType): Promise<PromptTestCase> {
      const prompt = await promptRepo.findById(data.promptId);
      if (!prompt) {
        throw notFoundByIdError("Prompt", data.promptId);
      }
      return testCaseRepo.create({
        promptId: data.promptId,
        name: data.name,
        inputValues: data.inputValues ?? {},
        expectedOutput: data.expectedOutput ?? null,
      });
    },

    async update(data: UpdateTestCaseInputType): Promise<PromptTestCase> {
      const tc = await testCaseRepo.update(data.id, {
        name: data.name,
        inputValues: data.inputValues,
        expectedOutput: data.expectedOutput,
        status: data.status,
      });
      if (!tc) {
        throw notFoundByIdError("Test case", data.id);
      }
      return tc;
    },

    async delete(id: string): Promise<{ success: boolean }> {
      const deleted = await testCaseRepo.delete(id);
      if (!deleted) {
        throw notFoundByIdError("Test case", id);
      }
      return { success: true };
    },
  };
}

export type TestCaseService = ReturnType<typeof createTestCaseService>;

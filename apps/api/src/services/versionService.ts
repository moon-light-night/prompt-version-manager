import { extractVariables, diffStrings } from "@pvm/shared";
import type { VersionRepository } from "@/repositories/versionRepository";
import type { PromptRepository } from "@/repositories/promptRepository";
import type { PromptVersion, VersionCompareResult } from "@pvm/shared";
import type { CreateVersionInputType, CompareVersionsInputType } from "@/schemas/versionSchemas";
import { notFoundByIdError } from "./serviceErrors";

export function createVersionService(
  versionRepo: VersionRepository,
  promptRepo: PromptRepository,
) {
  return {
    async listVersionsByPrompt(promptId: string): Promise<PromptVersion[]> {
      const prompt = await promptRepo.findById(promptId);
      if (!prompt) {
        throw notFoundByIdError("Prompt", promptId);
      }
      return versionRepo.findByPromptId(promptId);
    },

    async createVersion(data: CreateVersionInputType): Promise<PromptVersion> {
      const prompt = await promptRepo.findById(data.promptId);
      if (!prompt) {
        throw notFoundByIdError("Prompt", data.promptId);
      }

      const variables = extractVariables(data.content);

      return versionRepo.create({
        promptId: data.promptId,
        content: data.content,
        variables,
        label: data.label ?? null,
      });
    },

    async getById(id: string): Promise<PromptVersion> {
      const version = await versionRepo.findById(id);
      if (!version) {
        throw notFoundByIdError("Version", id);
      }
      return version;
    },

    async compareVersions(data: CompareVersionsInputType): Promise<VersionCompareResult> {
      const [versionA, versionB] = await Promise.all([
        versionRepo.findById(data.versionAId),
        versionRepo.findById(data.versionBId),
      ]);

      if (!versionA) {
        throw notFoundByIdError("Version", data.versionAId);
      }
      if (!versionB) {
        throw notFoundByIdError("Version", data.versionBId);
      }

      const diff = diffStrings(versionA.content, versionB.content);
      const setA = new Set(versionA.variables);
      const setB = new Set(versionB.variables);

      const addedVariables = versionB.variables.filter((v) => !setA.has(v));
      const removedVariables = versionA.variables.filter((v) => !setB.has(v));

      return { versionA, versionB, diff, addedVariables, removedVariables };
    },
  };
}

export type VersionService = ReturnType<typeof createVersionService>;

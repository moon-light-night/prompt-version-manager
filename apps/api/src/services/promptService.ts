import type { PromptRepository } from "@/repositories/promptRepository";
import type {
  Prompt,
  PromptWithMeta,
  PaginatedResult,
} from "@pvm/shared";
import type { ListPromptsInputType, CreatePromptInputType, UpdatePromptInputType } from "@/schemas/promptSchemas";
import { notFoundByIdError } from "./serviceErrors";

export function createPromptService(repo: PromptRepository) {
  return {
    async listPrompts(
      params: ListPromptsInputType,
    ): Promise<PaginatedResult<PromptWithMeta>> {
      const [items, total] = await Promise.all([
        repo.findMany(params),
        repo.count({
          status: params.status,
          search: params.search,
          tagIds: params.tagIds,
        }),
      ]);
      return { items, total, limit: params.limit, offset: params.offset };
    },

    async getPromptById(id: string): Promise<PromptWithMeta> {
      const prompt = await repo.findById(id);
      if (!prompt) {
        throw notFoundByIdError("Prompt", id);
      }
      return prompt;
    },

    async createPrompt(data: CreatePromptInputType): Promise<Prompt> {
      return repo.create({
        title: data.title,
        description: data.description ?? null,
      });
    },

    async updatePrompt(data: UpdatePromptInputType): Promise<Prompt> {
      const updated = await repo.update(data.id, {
        title: data.title,
        description: data.description,
      });
      if (!updated) {
        throw notFoundByIdError("Prompt", data.id);
      }
      return updated;
    },

    async archivePrompt(id: string): Promise<Prompt> {
      const archived = await repo.archive(id);
      if (!archived) {
        throw notFoundByIdError("Prompt", id);
      }
      return archived;
    },
  };
}

export type PromptService = ReturnType<typeof createPromptService>;

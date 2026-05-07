import type { TagRepository } from "@/repositories/tagRepository";
import type { Tag } from "@pvm/shared";
import type { CreateTagInputType } from "@/schemas/tagSchemas";
import { conflictError, notFoundByIdError } from "./serviceErrors";

export function createTagService(repo: TagRepository) {
  return {
    async listTags(): Promise<Tag[]> {
      return repo.findMany();
    },

    async createTag(data: CreateTagInputType): Promise<Tag> {
      const existing = await repo.findByName(data.name);
      if (existing) {
        throw conflictError(`Tag with name "${data.name}" already exists`);
      }
      return repo.create({
        name: data.name,
        color: data.color ?? null,
      });
    },

    async getTagsByPromptId(promptId: string): Promise<Tag[]> {
      return repo.findTagsByPromptId(promptId);
    },

    async attachTag(promptId: string, tagId: string): Promise<void> {
      const tag = await repo.findById(tagId);
      if (!tag) {
        throw notFoundByIdError("Tag", tagId);
      }
      await repo.attachTag(promptId, tagId);
    },

    async detachTag(promptId: string, tagId: string): Promise<void> {
      await repo.detachTag(promptId, tagId);
    },
  };
}

export type TagService = ReturnType<typeof createTagService>;

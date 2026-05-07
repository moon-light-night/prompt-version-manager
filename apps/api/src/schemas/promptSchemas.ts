import { z } from "zod";

export const CreatePromptInput = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).nullish(),
});

export const UpdatePromptInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullish(),
});

export const ArchivePromptInput = z.object({
  id: z.string().uuid(),
});

export const GetPromptByIdInput = z.object({
  id: z.string().uuid(),
});

export const PromptSortEnum = z.enum(["updated_desc", "updated_asc", "title_asc", "title_desc", "created_desc"]);
export type PromptSort = z.infer<typeof PromptSortEnum>;

export const ListPromptsInput = z.object({
  status: z.enum(["active", "archived"]).optional(),
  search: z.string().max(200).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  sort: PromptSortEnum.default("updated_desc"),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type CreatePromptInputType = z.infer<typeof CreatePromptInput>;
export type UpdatePromptInputType = z.infer<typeof UpdatePromptInput>;
export type ListPromptsInputType = z.infer<typeof ListPromptsInput>;

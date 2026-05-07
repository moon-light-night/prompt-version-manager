import { z } from "zod";

export const CreateTagInput = z.object({
  name: z.string().min(1, "Tag name is required").max(100),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #6366f1")
    .nullish(),
});

export const ListTagsInput = z.object({});

export const GetPromptTagsInput = z.object({
  promptId: z.string().uuid(),
});

export const AttachTagInput = z.object({
  promptId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export const DetachTagInput = z.object({
  promptId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export type CreateTagInputType = z.infer<typeof CreateTagInput>;
export type AttachTagInputType = z.infer<typeof AttachTagInput>;
export type DetachTagInputType = z.infer<typeof DetachTagInput>;

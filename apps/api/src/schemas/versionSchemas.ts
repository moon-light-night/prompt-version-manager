import { z } from "zod";

export const GetVersionByIdInput = z.object({
  id: z.string().uuid(),
});

export const CompareVersionsInput = z.object({
  versionAId: z.string().uuid(),
  versionBId: z.string().uuid(),
});

export type GetVersionByIdInputType = z.infer<typeof GetVersionByIdInput>;
export type CompareVersionsInputType = z.infer<typeof CompareVersionsInput>;

export const CreateVersionInput = z.object({
  promptId: z.string().uuid(),
  content: z.string().min(1, "Content is required"),
  label: z.string().max(200).nullish(),
});

export const ListVersionsByPromptInput = z.object({
  promptId: z.string().uuid(),
});

export type CreateVersionInputType = z.infer<typeof CreateVersionInput>;

import { z } from "zod";

export const ListTestCasesByPromptInput = z.object({
  promptId: z.string().uuid(),
  includeArchived: z.boolean().optional().default(false),
});

export const GetTestCaseByIdInput = z.object({
  id: z.string().uuid(),
});

export const CreateTestCaseInput = z.object({
  promptId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  inputValues: z.record(z.string()).optional().default({}),
  expectedOutput: z.string().nullish(),
});

export const UpdateTestCaseInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  inputValues: z.record(z.string()).optional(),
  expectedOutput: z.string().nullish(),
  status: z.enum(["active", "archived"]).optional(),
});

export const DeleteTestCaseInput = z.object({
  id: z.string().uuid(),
});

export type ListTestCasesByPromptInputType = z.infer<typeof ListTestCasesByPromptInput>;
export type GetTestCaseByIdInputType = z.infer<typeof GetTestCaseByIdInput>;
export type CreateTestCaseInputType = z.infer<typeof CreateTestCaseInput>;
export type UpdateTestCaseInputType = z.infer<typeof UpdateTestCaseInput>;
export type DeleteTestCaseInputType = z.infer<typeof DeleteTestCaseInput>;

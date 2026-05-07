import { z } from "zod";
import {
  PROMPT_RUN_DEFAULT_LIMIT_BY_PROMPT,
  PROMPT_RUN_DEFAULT_LIMIT_BY_TEST_CASE,
  PROMPT_RUN_DEFAULT_LIMIT_BY_VERSION,
  PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
  PROMPT_RUN_PAGINATION_MAX_LIMIT,
  PROMPT_RUN_PAGINATION_MIN_LIMIT,
} from "@/constants/promptRun.constants";

export const ListRunsByPromptInput = z.object({
  promptId: z.string().uuid(),
  limit: z
    .number()
    .int()
    .min(PROMPT_RUN_PAGINATION_MIN_LIMIT)
    .max(PROMPT_RUN_PAGINATION_MAX_LIMIT)
    .optional()
    .default(PROMPT_RUN_DEFAULT_LIMIT_BY_PROMPT),
  offset: z
    .number()
    .int()
    .min(PROMPT_RUN_PAGINATION_DEFAULT_OFFSET)
    .optional()
    .default(PROMPT_RUN_PAGINATION_DEFAULT_OFFSET),
});

export const ListRunsByVersionInput = z.object({
  versionId: z.string().uuid(),
  limit: z
    .number()
    .int()
    .min(PROMPT_RUN_PAGINATION_MIN_LIMIT)
    .max(PROMPT_RUN_PAGINATION_MAX_LIMIT)
    .optional()
    .default(PROMPT_RUN_DEFAULT_LIMIT_BY_VERSION),
  offset: z
    .number()
    .int()
    .min(PROMPT_RUN_PAGINATION_DEFAULT_OFFSET)
    .optional()
    .default(PROMPT_RUN_PAGINATION_DEFAULT_OFFSET),
});

export const ListRunsByTestCaseInput = z.object({
  testCaseId: z.string().uuid(),
  limit: z
    .number()
    .int()
    .min(PROMPT_RUN_PAGINATION_MIN_LIMIT)
    .max(PROMPT_RUN_PAGINATION_MAX_LIMIT)
    .optional()
    .default(PROMPT_RUN_DEFAULT_LIMIT_BY_TEST_CASE),
  offset: z
    .number()
    .int()
    .min(PROMPT_RUN_PAGINATION_DEFAULT_OFFSET)
    .optional()
    .default(PROMPT_RUN_PAGINATION_DEFAULT_OFFSET),
});

export const GetRunByIdInput = z.object({
  id: z.string().uuid(),
});

export const CreateRunInput = z.object({
  testCaseId: z.string().uuid(),
  versionId: z.string().uuid(),
  actualOutput: z.string().min(1, "Actual output is required"),
  score: z.number().int().min(1).max(5).nullish(),
  notes: z.string().nullish(),
});

export type ListRunsByPromptInputType = z.infer<typeof ListRunsByPromptInput>;
export type ListRunsByVersionInputType = z.infer<typeof ListRunsByVersionInput>;
export type ListRunsByTestCaseInputType = z.infer<typeof ListRunsByTestCaseInput>;
export type GetRunByIdInputType = z.infer<typeof GetRunByIdInput>;
export type CreateRunInputType = z.infer<typeof CreateRunInput>;

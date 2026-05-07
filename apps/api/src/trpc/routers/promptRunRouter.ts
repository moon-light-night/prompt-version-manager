import { router, publicProcedure } from "../init";
import {
  ListRunsByPromptInput,
  ListRunsByVersionInput,
  ListRunsByTestCaseInput,
  GetRunByIdInput,
  CreateRunInput,
} from "@/schemas/promptRunSchemas";

export const promptRunRouter = router({
  listByPrompt: publicProcedure
    .input(ListRunsByPromptInput)
    .query(({ ctx, input }) =>
      ctx.services.promptRun.listByPrompt(input.promptId, input.limit, input.offset),
    ),

  listByVersion: publicProcedure
    .input(ListRunsByVersionInput)
    .query(({ ctx, input }) =>
      ctx.services.promptRun.listByVersion(input.versionId, input.limit, input.offset),
    ),

  listByTestCase: publicProcedure
    .input(ListRunsByTestCaseInput)
    .query(({ ctx, input }) =>
      ctx.services.promptRun.listByTestCase(input.testCaseId, input.limit, input.offset),
    ),

  byId: publicProcedure
    .input(GetRunByIdInput)
    .query(({ ctx, input }) => ctx.services.promptRun.getById(input.id)),

  create: publicProcedure
    .input(CreateRunInput)
    .mutation(({ ctx, input }) => ctx.services.promptRun.create(input)),
});

import { router, publicProcedure } from "../init";
import {
  ListTestCasesByPromptInput,
  GetTestCaseByIdInput,
  CreateTestCaseInput,
  UpdateTestCaseInput,
  DeleteTestCaseInput,
} from "@/schemas/testCaseSchemas";

export const testCaseRouter = router({
  listByPrompt: publicProcedure
    .input(ListTestCasesByPromptInput)
    .query(({ ctx, input }) =>
      ctx.services.testCase.listByPrompt(input.promptId, input.includeArchived),
    ),

  byId: publicProcedure
    .input(GetTestCaseByIdInput)
    .query(({ ctx, input }) => ctx.services.testCase.getById(input.id)),

  create: publicProcedure
    .input(CreateTestCaseInput)
    .mutation(({ ctx, input }) => ctx.services.testCase.create(input)),

  update: publicProcedure
    .input(UpdateTestCaseInput)
    .mutation(({ ctx, input }) => ctx.services.testCase.update(input)),

  delete: publicProcedure
    .input(DeleteTestCaseInput)
    .mutation(({ ctx, input }) => ctx.services.testCase.delete(input.id)),
});

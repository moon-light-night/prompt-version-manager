import { router, publicProcedure } from "../init";
import {
  ListVersionsByPromptInput,
  CreateVersionInput,
  GetVersionByIdInput,
  CompareVersionsInput,
} from "@/schemas/versionSchemas";

export const versionRouter = router({
  listByPrompt: publicProcedure
    .input(ListVersionsByPromptInput)
    .query(({ ctx, input }) => {
      return ctx.services.version.listVersionsByPrompt(input.promptId);
    }),

  create: publicProcedure
    .input(CreateVersionInput)
    .mutation(({ ctx, input }) => {
      return ctx.services.version.createVersion(input);
    }),

  byId: publicProcedure
    .input(GetVersionByIdInput)
    .query(({ ctx, input }) => {
      return ctx.services.version.getById(input.id);
    }),

  compare: publicProcedure
    .input(CompareVersionsInput)
    .query(({ ctx, input }) => {
      return ctx.services.version.compareVersions(input);
    }),
});

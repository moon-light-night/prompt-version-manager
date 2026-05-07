import { router, publicProcedure } from "../init";
import {
  ListPromptsInput,
  GetPromptByIdInput,
  CreatePromptInput,
  UpdatePromptInput,
  ArchivePromptInput,
} from "@/schemas/promptSchemas";

export const promptRouter = router({
  list: publicProcedure.input(ListPromptsInput).query(({ ctx, input }) => {
    return ctx.services.prompt.listPrompts(input);
  }),

  byId: publicProcedure.input(GetPromptByIdInput).query(({ ctx, input }) => {
    return ctx.services.prompt.getPromptById(input.id);
  }),

  create: publicProcedure.input(CreatePromptInput).mutation(({ ctx, input }) => {
    return ctx.services.prompt.createPrompt(input);
  }),

  update: publicProcedure.input(UpdatePromptInput).mutation(({ ctx, input }) => {
    return ctx.services.prompt.updatePrompt(input);
  }),

  archive: publicProcedure.input(ArchivePromptInput).mutation(({ ctx, input }) => {
    return ctx.services.prompt.archivePrompt(input.id);
  }),
});

import { router, publicProcedure } from "../init";
import { CreateTagInput, GetPromptTagsInput, AttachTagInput, DetachTagInput } from "@/schemas/tagSchemas";
import { z } from "zod";

export const tagRouter = router({
  list: publicProcedure.input(z.void().optional()).query(({ ctx }) => {
    return ctx.services.tag.listTags();
  }),

  create: publicProcedure.input(CreateTagInput).mutation(({ ctx, input }) => {
    return ctx.services.tag.createTag(input);
  }),

  getByPrompt: publicProcedure.input(GetPromptTagsInput).query(({ ctx, input }) => {
    return ctx.services.tag.getTagsByPromptId(input.promptId);
  }),

  attach: publicProcedure.input(AttachTagInput).mutation(({ ctx, input }) => {
    return ctx.services.tag.attachTag(input.promptId, input.tagId);
  }),

  detach: publicProcedure.input(DetachTagInput).mutation(({ ctx, input }) => {
    return ctx.services.tag.detachTag(input.promptId, input.tagId);
  }),
});

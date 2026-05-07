import type { Context } from "@/trpc/context";
import type { PromptWithMeta } from "@pvm/shared";
import { PromptSortEnum } from "@/schemas/promptSchemas";
import {
  DEFAULT_PROMPT_LIMIT,
  DEFAULT_PROMPT_OFFSET,
  DEFAULT_PROMPT_SORT,
} from "@/constants/prompt.constants";
import { logger } from "@/lib/logger";
import { LOG_EVENTS } from "@/constants/logger.constants";

interface PromptsArgs {
  status?: "active" | "archived";
  search?: string;
  tagIds?: string[];
  sort?: string;
  limit?: number;
  offset?: number;
}

interface PromptArgs {
  id: string;
}

interface PromptVersionsArgs {
  promptId: string;
}

async function getPromptTags(promptId: string, ctx: Context) {
  return ctx.services.tag.getTagsByPromptId(promptId);
}

const resolvePromptSort = (sort: string | undefined) => {
  const parsed = PromptSortEnum.safeParse(sort);
  return parsed.success ? parsed.data : DEFAULT_PROMPT_SORT;
};

export const resolvers = {
  Query: {
    async prompts(_parent: unknown, args: PromptsArgs, ctx: Context) {
      return ctx.services.prompt.listPrompts({
        status: args.status,
        search: args.search,
        tagIds: args.tagIds,
        sort: resolvePromptSort(args.sort),
        limit: args.limit ?? DEFAULT_PROMPT_LIMIT,
        offset: args.offset ?? DEFAULT_PROMPT_OFFSET,
      });
    },

    async prompt(_parent: unknown, args: PromptArgs, ctx: Context) {
      try {
        return await ctx.services.prompt.getPromptById(args.id);
      } catch (error) {
        logger.error(
          {
            err: error,
            promptId: args.id,
            action: LOG_EVENTS.GRAPHQL_PROMPT_QUERY_FAILED,
          },
          "GraphQL prompt query failed",
        );
        return null;
      }
    },

    async promptVersions(_parent: unknown, args: PromptVersionsArgs, ctx: Context) {
      try {
        return await ctx.services.version.listVersionsByPrompt(args.promptId);
      } catch (error) {
        logger.error(
          {
            err: error,
            promptId: args.promptId,
            action: LOG_EVENTS.GRAPHQL_PROMPT_VERSIONS_QUERY_FAILED,
          },
          "GraphQL promptVersions query failed",
        );
        return [];
      }
    },

    async tags(_parent: unknown, _args: unknown, ctx: Context) {
      return ctx.services.tag.listTags();
    },

    async dashboardSummary(_parent: unknown, _args: unknown, ctx: Context) {
      return ctx.services.dashboard.getSummary();
    },
  },

  Prompt: {
    async tags(prompt: PromptWithMeta, _args: unknown, ctx: Context) {
      return getPromptTags(prompt.id, ctx);
    },
  },
};

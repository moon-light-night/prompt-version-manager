import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/router";
import { createContext } from "@/trpc/context";
import { logger } from "@/lib/logger";
import { LOG_EVENTS } from "@/constants/logger.constants";

export const runtime = "nodejs";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    onError({ error, path }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        logger.error(
          {
            err: error,
            path: path ?? "unknown",
            action: LOG_EVENTS.TRPC_INTERNAL_ERROR,
          },
          "Unhandled tRPC internal error",
        );
      }
    },
  });

export { handler as GET, handler as POST };

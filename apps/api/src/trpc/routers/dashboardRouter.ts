import { router, publicProcedure } from "@/trpc/init";

export const dashboardRouter = router({
  summary: publicProcedure.query(async ({ ctx }) => {
    return ctx.services.dashboard.getSummary();
  }),
});

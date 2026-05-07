import { router } from "./init";
import { promptRouter } from "./routers/promptRouter";
import { versionRouter } from "./routers/versionRouter";
import { tagRouter } from "./routers/tagRouter";
import { testCaseRouter } from "./routers/testCaseRouter";
import { promptRunRouter } from "./routers/promptRunRouter";
import { dashboardRouter } from "./routers/dashboardRouter";

export const appRouter = router({
  prompt: promptRouter,
  promptVersion: versionRouter,
  tag: tagRouter,
  testCase: testCaseRouter,
  promptRun: promptRunRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;

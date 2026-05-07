import type { Pool } from "pg";
import type { Logger } from "pino";
import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";
import { createPromptRepository } from "@/repositories/promptRepository";
import { createVersionRepository } from "@/repositories/versionRepository";
import { createTagRepository } from "@/repositories/tagRepository";
import { createTestCaseRepository } from "@/repositories/testCaseRepository";
import { createPromptRunRepository } from "@/repositories/promptRunRepository";
import { createPromptService } from "@/services/promptService";
import { createVersionService } from "@/services/versionService";
import { createTagService } from "@/services/tagService";
import { createTestCaseService } from "@/services/testCaseService";
import { createPromptRunService } from "@/services/promptRunService";
import type { PromptService } from "@/services/promptService";
import type { VersionService } from "@/services/versionService";
import type { TagService } from "@/services/tagService";
import type { TestCaseService } from "@/services/testCaseService";
import type { PromptRunService } from "@/services/promptRunService";
import { createDashboardService } from "@/services/dashboardService";
import type { DashboardService } from "@/services/dashboardService";

export interface Context {
  pool: Pool;
  logger: Logger;
  services: {
    prompt: PromptService;
    version: VersionService;
    tag: TagService;
    testCase: TestCaseService;
    promptRun: PromptRunService;
    dashboard: DashboardService;
  };
}

export function createContext(): Context {
  const pool = getPool();

  const promptRepo = createPromptRepository(pool);
  const versionRepo = createVersionRepository(pool);
  const tagRepo = createTagRepository(pool);
  const testCaseRepo = createTestCaseRepository(pool);
  const promptRunRepo = createPromptRunRepository(pool);

  return {
    pool,
    logger,
    services: {
      prompt: createPromptService(promptRepo),
      version: createVersionService(versionRepo, promptRepo),
      tag: createTagService(tagRepo),
      testCase: createTestCaseService(testCaseRepo, promptRepo),
      promptRun: createPromptRunService(promptRunRepo, testCaseRepo, versionRepo),
      dashboard: createDashboardService(pool, promptRepo),
    },
  };
}

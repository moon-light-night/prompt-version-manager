import type { Pool } from "pg";
import type { PromptWithMeta } from "@pvm/shared";
import type { PromptRepository } from "@/repositories/promptRepository";

export interface DashboardSummary {
  totalPrompts: number;
  activePrompts: number;
  archivedPrompts: number;
  totalVersions: number;
  totalTestCases: number;
  totalRuns: number;
  recentPrompts: PromptWithMeta[];
  recentRuns: RecentRun[];
}

export interface RecentRun {
  id: string;
  testCaseId: string;
  testCaseName: string;
  versionId: string;
  versionNumber: number;
  promptId: string;
  promptTitle: string;
  score: number | null;
  actualOutput: string;
  ranAt: string;
}

export function createDashboardService(pool: Pool, promptRepo: PromptRepository) {
  return {
    async getSummary(): Promise<DashboardSummary> {
      const [countsResult, recentPromptsResult, recentRunsResult] = await Promise.all([
        pool.query<{
          total_prompts: string;
          active_prompts: string;
          archived_prompts: string;
          total_versions: string;
          total_test_cases: string;
          total_runs: string;
        }>(`
          SELECT
            COUNT(*) FILTER (WHERE TRUE)::text                  AS total_prompts,
            COUNT(*) FILTER (WHERE status = 'active')::text     AS active_prompts,
            COUNT(*) FILTER (WHERE status = 'archived')::text   AS archived_prompts,
            (SELECT COUNT(*)::text FROM prompt_versions)        AS total_versions,
            (SELECT COUNT(*)::text FROM prompt_test_cases WHERE status = 'active') AS total_test_cases,
            (SELECT COUNT(*)::text FROM prompt_runs)            AS total_runs
          FROM prompts
        `),

        promptRepo.findMany({ limit: 5, offset: 0, sort: "updated_desc" }),

        pool.query<{
          id: string;
          test_case_id: string;
          test_case_name: string;
          version_id: string;
          version_number: string;
          prompt_id: string;
          prompt_title: string;
          score: number | null;
          actual_output: string;
          ran_at: Date;
        }>(`
          SELECT
            pr.id,
            pr.test_case_id,
            tc.name                     AS test_case_name,
            pr.version_id,
            pv.version_number::text     AS version_number,
            p.id                        AS prompt_id,
            p.title                     AS prompt_title,
            pr.score,
            pr.actual_output,
            pr.ran_at
          FROM prompt_runs pr
          JOIN prompt_test_cases tc ON tc.id = pr.test_case_id
          JOIN prompt_versions pv  ON pv.id = pr.version_id
          JOIN prompts p           ON p.id  = tc.prompt_id
          ORDER BY pr.ran_at DESC
          LIMIT 5
        `),
      ]);

      const counts = countsResult.rows[0];

      return {
        totalPrompts: Number(counts?.total_prompts ?? 0),
        activePrompts: Number(counts?.active_prompts ?? 0),
        archivedPrompts: Number(counts?.archived_prompts ?? 0),
        totalVersions: Number(counts?.total_versions ?? 0),
        totalTestCases: Number(counts?.total_test_cases ?? 0),
        totalRuns: Number(counts?.total_runs ?? 0),
        recentPrompts: recentPromptsResult,
        recentRuns: recentRunsResult.rows.map((r) => ({
          id: r.id,
          testCaseId: r.test_case_id,
          testCaseName: r.test_case_name,
          versionId: r.version_id,
          versionNumber: Number(r.version_number),
          promptId: r.prompt_id,
          promptTitle: r.prompt_title,
          score: r.score,
          actualOutput: r.actual_output,
          ranAt: r.ran_at.toISOString(),
        })),
      };
    },
  };
}

export type DashboardService = ReturnType<typeof createDashboardService>;

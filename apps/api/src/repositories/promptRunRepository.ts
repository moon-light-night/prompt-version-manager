import type { Pool, QueryResult } from "pg";
import type { PromptRun } from "@pvm/shared";
import {
  PROMPT_RUN_DEFAULT_LIMIT_BY_PROMPT,
  PROMPT_RUN_DEFAULT_LIMIT_BY_TEST_CASE,
  PROMPT_RUN_DEFAULT_LIMIT_BY_VERSION,
  PROMPT_RUN_ORDER_BY_RAN_AT_DESC,
  PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
  PROMPT_RUNS_TABLE,
  PROMPT_TEST_CASES_TABLE,
} from "@/constants/promptRun.constants";

interface PromptRunRow {
  id: string;
  test_case_id: string;
  version_id: string;
  actual_output: string;
  score: number | null;
  notes: string | null;
  latency_ms: number | null;
  model: string | null;
  status: "completed" | "error";
  ran_at: Date;
}

function mapRow(row: PromptRunRow): PromptRun {
  return {
    id: row.id,
    testCaseId: row.test_case_id,
    versionId: row.version_id,
    actualOutput: row.actual_output,
    score: (row.score as PromptRun["score"]) ?? null,
    notes: row.notes,
    latencyMs: row.latency_ms,
    model: row.model,
    status: row.status,
    ranAt: row.ran_at.toISOString(),
  };
}

export function createPromptRunRepository(pool: Pool) {
  return {
    async findByPromptId(
      promptId: string,
      limit = PROMPT_RUN_DEFAULT_LIMIT_BY_PROMPT,
      offset = PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
    ): Promise<PromptRun[]> {
      const sql = `
        SELECT pr.*
        FROM ${PROMPT_RUNS_TABLE} pr
        JOIN ${PROMPT_TEST_CASES_TABLE} ptc ON ptc.id = pr.test_case_id
        WHERE ptc.prompt_id = $1
        ORDER BY pr.ran_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result: QueryResult<PromptRunRow> = await pool.query(sql, [
        promptId,
        limit,
        offset,
      ]);
      return result.rows.map(mapRow);
    },

    async findByVersionId(
      versionId: string,
      limit = PROMPT_RUN_DEFAULT_LIMIT_BY_VERSION,
      offset = PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
    ): Promise<PromptRun[]> {
      const sql = `
        SELECT * FROM ${PROMPT_RUNS_TABLE}
        WHERE version_id = $1
        ${PROMPT_RUN_ORDER_BY_RAN_AT_DESC}
        LIMIT $2 OFFSET $3
      `;
      const result: QueryResult<PromptRunRow> = await pool.query(sql, [
        versionId,
        limit,
        offset,
      ]);
      return result.rows.map(mapRow);
    },

    async findByTestCaseId(
      testCaseId: string,
      limit = PROMPT_RUN_DEFAULT_LIMIT_BY_TEST_CASE,
      offset = PROMPT_RUN_PAGINATION_DEFAULT_OFFSET,
    ): Promise<PromptRun[]> {
      const sql = `
        SELECT * FROM ${PROMPT_RUNS_TABLE}
        WHERE test_case_id = $1
        ${PROMPT_RUN_ORDER_BY_RAN_AT_DESC}
        LIMIT $2 OFFSET $3
      `;
      const result: QueryResult<PromptRunRow> = await pool.query(sql, [
        testCaseId,
        limit,
        offset,
      ]);
      return result.rows.map(mapRow);
    },

    async findById(id: string): Promise<PromptRun | null> {
      const result: QueryResult<PromptRunRow> = await pool.query(
        `SELECT * FROM ${PROMPT_RUNS_TABLE} WHERE id = $1`,
        [id],
      );
      const row = result.rows[0];
      return row ? mapRow(row) : null;
    },

    async create(data: {
      testCaseId: string;
      versionId: string;
      actualOutput: string;
      score: number | null;
      notes: string | null;
    }): Promise<PromptRun> {
      const sql = `
        INSERT INTO ${PROMPT_RUNS_TABLE}
          (test_case_id, version_id, actual_output, score, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result: QueryResult<PromptRunRow> = await pool.query(sql, [
        data.testCaseId,
        data.versionId,
        data.actualOutput,
        data.score,
        data.notes,
      ]);
      return mapRow(result.rows[0]!);
    },
  };
}

export type PromptRunRepository = ReturnType<typeof createPromptRunRepository>;

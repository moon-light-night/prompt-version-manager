import type { Pool, QueryResult } from "pg";
import type { PromptTestCase } from "@pvm/shared";

interface TestCaseRow {
  id: string;
  prompt_id: string;
  name: string;
  input_values: Record<string, string>;
  expected_output: string | null;
  status: "active" | "archived";
  created_at: Date;
  updated_at: Date;
}

function mapRow(row: TestCaseRow): PromptTestCase {
  return {
    id: row.id,
    promptId: row.prompt_id,
    name: row.name,
    inputValues: row.input_values ?? {},
    expectedOutput: row.expected_output,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function createTestCaseRepository(pool: Pool) {
  return {
    async findByPromptId(
      promptId: string,
      includeArchived = false,
    ): Promise<PromptTestCase[]> {
      const sql = includeArchived
        ? `SELECT * FROM prompt_test_cases WHERE prompt_id = $1 ORDER BY created_at DESC`
        : `SELECT * FROM prompt_test_cases WHERE prompt_id = $1 AND status = 'active' ORDER BY created_at DESC`;
      const result: QueryResult<TestCaseRow> = await pool.query(sql, [promptId]);
      return result.rows.map(mapRow);
    },

    async findById(id: string): Promise<PromptTestCase | null> {
      const result: QueryResult<TestCaseRow> = await pool.query(
        "SELECT * FROM prompt_test_cases WHERE id = $1",
        [id],
      );
      const row = result.rows[0];
      return row ? mapRow(row) : null;
    },

    async create(data: {
      promptId: string;
      name: string;
      inputValues: Record<string, string>;
      expectedOutput: string | null;
    }): Promise<PromptTestCase> {
      const sql = `
        INSERT INTO prompt_test_cases (prompt_id, name, input_values, expected_output)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result: QueryResult<TestCaseRow> = await pool.query(sql, [
        data.promptId,
        data.name,
        JSON.stringify(data.inputValues),
        data.expectedOutput,
      ]);
      return mapRow(result.rows[0]!);
    },

    async update(
      id: string,
      data: {
        name?: string;
        inputValues?: Record<string, string>;
        expectedOutput?: string | null;
        status?: "active" | "archived";
      },
    ): Promise<PromptTestCase | null> {
      const setClauses: string[] = ["updated_at = NOW()"];
      const params: unknown[] = [];
      let paramIdx = 1;

      if (data.name !== undefined) {
        setClauses.push(`name = $${paramIdx++}`);
        params.push(data.name);
      }
      if (data.inputValues !== undefined) {
        setClauses.push(`input_values = $${paramIdx++}`);
        params.push(JSON.stringify(data.inputValues));
      }
      if (data.expectedOutput !== undefined) {
        setClauses.push(`expected_output = $${paramIdx++}`);
        params.push(data.expectedOutput);
      }
      if (data.status !== undefined) {
        setClauses.push(`status = $${paramIdx++}`);
        params.push(data.status);
      }

      params.push(id);
      const sql = `
        UPDATE prompt_test_cases
        SET ${setClauses.join(", ")}
        WHERE id = $${paramIdx}
        RETURNING *
      `;
      const result: QueryResult<TestCaseRow> = await pool.query(sql, params);
      const row = result.rows[0];
      return row ? mapRow(row) : null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await pool.query(
        "DELETE FROM prompt_test_cases WHERE id = $1",
        [id],
      );
      return (result.rowCount ?? 0) > 0;
    },
  };
}

export type TestCaseRepository = ReturnType<typeof createTestCaseRepository>;

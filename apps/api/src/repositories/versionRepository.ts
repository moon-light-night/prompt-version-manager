import type { Pool, QueryResult } from "pg";
import type { PromptVersion } from "@pvm/shared";
import {
  FIND_NEXT_VERSION_NUMBER_SQL,
  FIND_VERSION_BY_ID_SQL,
  FIND_VERSIONS_BY_PROMPT_ID_SQL,
  INSERT_VERSION_SQL,
  LOCK_PROMPT_VERSIONS_BY_PROMPT_ID_SQL,
} from "@/constants/version.constants";

interface PromptVersionRow {
  id: string;
  prompt_id: string;
  version_number: number;
  content: string;
  variables: string[];
  label: string | null;
  created_at: Date;
}

function mapRow(row: PromptVersionRow): PromptVersion {
  return {
    id: row.id,
    promptId: row.prompt_id,
    versionNumber: Number(row.version_number),
    content: row.content,
    variables: row.variables ?? [],
    label: row.label,
    createdAt: row.created_at.toISOString(),
  };
}

export function createVersionRepository(pool: Pool) {
  return {
    async findByPromptId(promptId: string): Promise<PromptVersion[]> {
      const result: QueryResult<PromptVersionRow> = await pool.query(
        FIND_VERSIONS_BY_PROMPT_ID_SQL,
        [promptId],
      );
      return result.rows.map(mapRow);
    },

    async findById(id: string): Promise<PromptVersion | null> {
      const result: QueryResult<PromptVersionRow> = await pool.query(
        FIND_VERSION_BY_ID_SQL,
        [id],
      );
      const row = result.rows[0];
      return row ? mapRow(row) : null;
    },

    async getNextVersionNumber(promptId: string): Promise<number> {
      const result = await pool.query<{ next_version_number: number }>(
        FIND_NEXT_VERSION_NUMBER_SQL,
        [promptId],
      );
      return Number(result.rows[0]?.next_version_number ?? 1);
    },

    async create(data: {
      promptId: string;
      content: string;
      variables: string[];
      label?: string | null;
    }): Promise<PromptVersion> {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        await client.query(LOCK_PROMPT_VERSIONS_BY_PROMPT_ID_SQL, [data.promptId]);

        const nextVersionNumberResult = await client.query<{ next_version_number: number }>(
          FIND_NEXT_VERSION_NUMBER_SQL,
          [data.promptId],
        );
        const versionNumber = Number(
          nextVersionNumberResult.rows[0]?.next_version_number ?? 1,
        );

        const result: QueryResult<PromptVersionRow> = await client.query(INSERT_VERSION_SQL, [
          data.promptId,
          versionNumber,
          data.content,
          JSON.stringify(data.variables),
          data.label ?? null,
        ]);

        await client.query("COMMIT");

        const row = result.rows[0];
        if (!row) throw new Error("Failed to create prompt version");
        return mapRow(row);
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch {
        }
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

export type VersionRepository = ReturnType<typeof createVersionRepository>;

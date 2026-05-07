import type { Pool, QueryResult } from "pg";
import type { Prompt, PromptStatus, PromptWithMeta } from "@pvm/shared";
import type { PromptSort } from "@/schemas/promptSchemas";

interface PromptRow {
  id: string;
  title: string;
  description: string | null;
  status: PromptStatus;
  created_at: Date;
  updated_at: Date;
}

interface PromptWithMetaRow extends PromptRow {
  version_count: string;
  test_case_count: string;
  latest_version_id: string | null;
  latest_version_number: string | null;
  latest_version_content: string | null;
  latest_version_variables: string[] | null;
  latest_version_label: string | null;
  latest_version_created_at: Date | null;
  tags: Array<{ id: string; name: string; color: string | null; createdAt: string }>;
}

function mapPromptRow(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapPromptWithMetaRow(row: PromptWithMetaRow): PromptWithMeta {
  return {
    ...mapPromptRow(row),
    versionCount: Number(row.version_count),
    testCaseCount: Number(row.test_case_count),
    tags: row.tags ?? [],
    latestVersion:
      row.latest_version_id != null
        ? {
            id: row.latest_version_id,
            promptId: row.id,
            versionNumber: Number(row.latest_version_number ?? 0),
            content: row.latest_version_content ?? "",
            variables: row.latest_version_variables ?? [],
            label: row.latest_version_label,
            createdAt:
              row.latest_version_created_at?.toISOString() ?? new Date().toISOString(),
          }
        : null,
  };
}

const PROMPT_WITH_META_SELECT = `
  SELECT
    p.id,
    p.title,
    p.description,
    p.status,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT pv.id)::text   AS version_count,
    COUNT(DISTINCT tc.id)::text   AS test_case_count,
    lv.id                         AS latest_version_id,
    lv.version_number::text       AS latest_version_number,
    lv.content                    AS latest_version_content,
    lv.variables                  AS latest_version_variables,
    lv.label                      AS latest_version_label,
    lv.created_at                 AS latest_version_created_at,
    COALESCE(
      (SELECT json_agg(
        json_build_object('id', t.id, 'name', t.name, 'color', t.color, 'createdAt', t.created_at::text)
        ORDER BY t.name
      )
      FROM tags t
      JOIN prompt_tags pt ON pt.tag_id = t.id
      WHERE pt.prompt_id = p.id),
      '[]'::json
    )                             AS tags
  FROM prompts p
  LEFT JOIN prompt_versions pv ON pv.prompt_id = p.id
  LEFT JOIN prompt_test_cases tc ON tc.prompt_id = p.id AND tc.status = 'active'
  LEFT JOIN LATERAL (
    SELECT * FROM prompt_versions
    WHERE prompt_id = p.id
    ORDER BY version_number DESC
    LIMIT 1
  ) lv ON true
`;

export interface FindManyPromptsParams {
  status?: PromptStatus;
  search?: string;
  tagIds?: string[];
  sort?: PromptSort;
  limit: number;
  offset: number;
}

const SORT_MAP: Record<string, string> = {
  updated_desc: "p.updated_at DESC",
  updated_asc: "p.updated_at ASC",
  title_asc: "p.title ASC",
  title_desc: "p.title DESC",
  created_desc: "p.created_at DESC",
};

export function createPromptRepository(pool: Pool) {
  return {
    async findMany(params: FindManyPromptsParams): Promise<PromptWithMeta[]> {
      const conditions: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (params.status) {
        conditions.push(`p.status = $${idx++}`);
        values.push(params.status);
      }
      if (params.search) {
        conditions.push(
          `(p.title ILIKE $${idx} OR p.description ILIKE $${idx})`,
        );
        values.push(`%${params.search}%`);
        idx++;
      }
      if (params.tagIds && params.tagIds.length > 0) {
        conditions.push(
          `p.id IN (SELECT prompt_id FROM prompt_tags WHERE tag_id = ANY($${idx++}::uuid[]))`,
        );
        values.push(params.tagIds);
      }

      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const orderBy = SORT_MAP[params.sort ?? "updated_desc"] ?? "p.updated_at DESC";

      const sql = `
        ${PROMPT_WITH_META_SELECT}
        ${where}
        GROUP BY p.id, lv.id, lv.version_number, lv.content, lv.variables, lv.label, lv.created_at
        ORDER BY ${orderBy}
        LIMIT $${idx++} OFFSET $${idx++}
      `;
      values.push(params.limit, params.offset);

      const result: QueryResult<PromptWithMetaRow> = await pool.query(sql, values);
      return result.rows.map(mapPromptWithMetaRow);
    },

    async count(params: Omit<FindManyPromptsParams, "limit" | "offset">): Promise<number> {
      const conditions: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (params.status) {
        conditions.push(`status = $${idx++}`);
        values.push(params.status);
      }
      if (params.search) {
        conditions.push(
          `(title ILIKE $${idx} OR description ILIKE $${idx})`,
        );
        values.push(`%${params.search}%`);
        idx++;
      }
      if (params.tagIds && params.tagIds.length > 0) {
        conditions.push(
          `id IN (SELECT prompt_id FROM prompt_tags WHERE tag_id = ANY($${idx++}::uuid[]))`,
        );
        values.push(params.tagIds);
      }

      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const sql = `SELECT COUNT(*)::text AS total FROM prompts ${where}`;
      const result = await pool.query<{ total: string }>(sql, values);
      return Number(result.rows[0]?.total ?? 0);
    },

    async findById(id: string): Promise<PromptWithMeta | null> {
      const sql = `
        ${PROMPT_WITH_META_SELECT}
        WHERE p.id = $1
        GROUP BY p.id, lv.id, lv.version_number, lv.content, lv.variables, lv.label, lv.created_at
      `;
      const result: QueryResult<PromptWithMetaRow> = await pool.query(sql, [id]);
      const row = result.rows[0];
      return row ? mapPromptWithMetaRow(row) : null;
    },

    async create(data: { title: string; description?: string | null }): Promise<Prompt> {
      const sql = `
        INSERT INTO prompts (title, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result: QueryResult<PromptRow> = await pool.query(sql, [
        data.title,
        data.description ?? null,
      ]);
      const row = result.rows[0];
      if (!row) throw new Error("Failed to create prompt");
      return mapPromptRow(row);
    },

    async update(
      id: string,
      data: { title?: string; description?: string | null },
    ): Promise<Prompt | null> {
      const sets: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data.title !== undefined) {
        sets.push(`title = $${idx++}`);
        values.push(data.title);
      }
      if (data.description !== undefined) {
        sets.push(`description = $${idx++}`);
        values.push(data.description);
      }

      if (sets.length === 0) return this.findById(id).then((p) => (p ? p : null));

      sets.push(`updated_at = NOW()`);
      values.push(id);

      const sql = `
        UPDATE prompts SET ${sets.join(", ")}
        WHERE id = $${idx}
        RETURNING *
      `;
      const result: QueryResult<PromptRow> = await pool.query(sql, values);
      const row = result.rows[0];
      return row ? mapPromptRow(row) : null;
    },

    async archive(id: string): Promise<Prompt | null> {
      const sql = `
        UPDATE prompts SET status = 'archived', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const result: QueryResult<PromptRow> = await pool.query(sql, [id]);
      const row = result.rows[0];
      return row ? mapPromptRow(row) : null;
    },
  };
}

export type PromptRepository = ReturnType<typeof createPromptRepository>;

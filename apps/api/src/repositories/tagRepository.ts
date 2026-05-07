import type { Pool, QueryResult } from "pg";
import type { Tag } from "@pvm/shared";

interface TagRow {
  id: string;
  name: string;
  color: string | null;
  created_at: Date;
}

function mapRow(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at.toISOString(),
  };
}

export function createTagRepository(pool: Pool) {
  return {
    async findMany(): Promise<Tag[]> {
      const result: QueryResult<TagRow> = await pool.query(
        "SELECT * FROM tags ORDER BY name ASC",
      );
      return result.rows.map(mapRow);
    },

    async findById(id: string): Promise<Tag | null> {
      const result: QueryResult<TagRow> = await pool.query(
        "SELECT * FROM tags WHERE id = $1",
        [id],
      );
      const row = result.rows[0];
      return row ? mapRow(row) : null;
    },

    async findByName(name: string): Promise<Tag | null> {
      const result: QueryResult<TagRow> = await pool.query(
        "SELECT * FROM tags WHERE LOWER(name) = LOWER($1)",
        [name],
      );
      const row = result.rows[0];
      return row ? mapRow(row) : null;
    },

    async create(data: { name: string; color?: string | null }): Promise<Tag> {
      const sql = `
        INSERT INTO tags (name, color)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result: QueryResult<TagRow> = await pool.query(sql, [
        data.name,
        data.color ?? null,
      ]);
      const row = result.rows[0];
      if (!row) throw new Error("Failed to create tag");
      return mapRow(row);
    },

    async findTagsByPromptId(promptId: string): Promise<Tag[]> {
      const result: QueryResult<TagRow> = await pool.query(
        `SELECT t.id, t.name, t.color, t.created_at
         FROM tags t
         JOIN prompt_tags pt ON pt.tag_id = t.id
         WHERE pt.prompt_id = $1
         ORDER BY t.name ASC`,
        [promptId],
      );
      return result.rows.map(mapRow);
    },

    async attachTag(promptId: string, tagId: string): Promise<void> {
      await pool.query(
        `INSERT INTO prompt_tags (prompt_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [promptId, tagId],
      );
    },

    async detachTag(promptId: string, tagId: string): Promise<void> {
      await pool.query(
        `DELETE FROM prompt_tags WHERE prompt_id = $1 AND tag_id = $2`,
        [promptId, tagId],
      );
    },
  };
}

export type TagRepository = ReturnType<typeof createTagRepository>;

import { describe, it, expect, vi } from "vitest";
import type { Pool } from "pg";
import { createVersionRepository } from "@/repositories/versionRepository";
import {
  FIND_NEXT_VERSION_NUMBER_SQL,
  INSERT_VERSION_SQL,
  LOCK_PROMPT_VERSIONS_BY_PROMPT_ID_SQL,
} from "@/constants/version.constants";

describe("VersionRepository.create", () => {
  const promptId = "00000000-0000-0000-0000-000000000001";

  it("creates version in transaction with advisory lock", async () => {
    const clientQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ next_version_number: 3 }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "00000000-0000-0000-0000-000000000002",
            prompt_id: promptId,
            version_number: 3,
            content: "Hello {{name}}",
            variables: ["name"],
            label: "v3",
            created_at: new Date("2026-01-01T00:00:00.000Z"),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const client = {
      query: clientQuery,
      release: vi.fn(),
    };

    const pool = {
      connect: vi.fn().mockResolvedValue(client),
    } as unknown as Pool;

    const repo = createVersionRepository(pool);

    const created = await repo.create({
      promptId,
      content: "Hello {{name}}",
      variables: ["name"],
      label: "v3",
    });

    expect(created.versionNumber).toBe(3);
    expect(created.promptId).toBe(promptId);
    expect(clientQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(clientQuery).toHaveBeenNthCalledWith(2, LOCK_PROMPT_VERSIONS_BY_PROMPT_ID_SQL, [
      promptId,
    ]);
    expect(clientQuery).toHaveBeenNthCalledWith(3, FIND_NEXT_VERSION_NUMBER_SQL, [promptId]);
    expect(clientQuery).toHaveBeenNthCalledWith(4, INSERT_VERSION_SQL, [
      promptId,
      3,
      "Hello {{name}}",
      JSON.stringify(["name"]),
      "v3",
    ]);
    expect(clientQuery).toHaveBeenNthCalledWith(5, "COMMIT");
    expect(client.release).toHaveBeenCalledTimes(1);
  });

  it("rolls back transaction when insert fails", async () => {
    const dbError = new Error("duplicate key value violates unique constraint");

    const clientQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ next_version_number: 2 }] })
      .mockRejectedValueOnce(dbError)
      .mockResolvedValueOnce({ rows: [] });

    const client = {
      query: clientQuery,
      release: vi.fn(),
    };

    const pool = {
      connect: vi.fn().mockResolvedValue(client),
    } as unknown as Pool;

    const repo = createVersionRepository(pool);

    await expect(
      repo.create({
        promptId,
        content: "Hello",
        variables: [],
      }),
    ).rejects.toThrow("duplicate key value violates unique constraint");

    expect(clientQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(clientQuery).toHaveBeenNthCalledWith(2, LOCK_PROMPT_VERSIONS_BY_PROMPT_ID_SQL, [
      promptId,
    ]);
    expect(clientQuery).toHaveBeenNthCalledWith(3, FIND_NEXT_VERSION_NUMBER_SQL, [promptId]);
    expect(clientQuery).toHaveBeenNthCalledWith(5, "ROLLBACK");
    expect(client.release).toHaveBeenCalledTimes(1);
  });
});

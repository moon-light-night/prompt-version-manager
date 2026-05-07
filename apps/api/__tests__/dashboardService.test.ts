import { describe, it, expect, vi } from "vitest";
import { ListPromptsInput } from "@/schemas/promptSchemas";
import { createDashboardService } from "@/services/dashboardService";
import type { PromptWithMeta } from "@pvm/shared";

describe("ListPromptsInput sort field", () => {
  it("defaults to updated_desc", () => {
    const result = ListPromptsInput.safeParse({ limit: 10, offset: 0 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort).toBe("updated_desc");
    }
  });

  it("accepts all valid sort values", () => {
    const validSorts = ["updated_desc", "updated_asc", "title_asc", "title_desc", "created_desc"];
    for (const sort of validSorts) {
      const result = ListPromptsInput.safeParse({ limit: 10, offset: 0, sort });
      expect(result.success).toBe(true);
    }
  });

  it("rejects unknown sort value", () => {
    const result = ListPromptsInput.safeParse({ limit: 10, offset: 0, sort: "unknown" });
    expect(result.success).toBe(false);
  });

  it("carries search, status, tagIds through", () => {
    const result = ListPromptsInput.safeParse({
      status: "active",
      search: "hello",
      tagIds: [],
      sort: "title_asc",
      limit: 20,
      offset: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("active");
      expect(result.data.search).toBe("hello");
      expect(result.data.sort).toBe("title_asc");
    }
  });
});

function makePromptWithMeta(overrides: Partial<PromptWithMeta> = {}): PromptWithMeta {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Mock Prompt",
    description: null,
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    versionCount: 2,
    testCaseCount: 1,
    tags: [],
    latestVersion: null,
    ...overrides,
  };
}

function makePool(countsRow: object, runsRows: object[]) {
  const pool = {
    query: vi
      .fn()
      .mockResolvedValueOnce({ rows: [countsRow] })
      .mockResolvedValueOnce({ rows: runsRows }),
  } as unknown as import("pg").Pool;
  return pool;
}

function makePromptRepo(recentPrompts: PromptWithMeta[]) {
  return {
    findMany: vi.fn().mockResolvedValue(recentPrompts),
  } as unknown as import("@/repositories/promptRepository").PromptRepository;
}

describe("DashboardService.getSummary()", () => {
  it("returns correct counts from pool", async () => {
    const countsRow = {
      total_prompts: "7",
      active_prompts: "5",
      archived_prompts: "2",
      total_versions: "12",
      total_test_cases: "8",
      total_runs: "20",
    };
    const pool = makePool(countsRow, []);
    const repo = makePromptRepo([makePromptWithMeta()]);
    const service = createDashboardService(pool, repo);

    const result = await service.getSummary();

    expect(result.totalPrompts).toBe(7);
    expect(result.activePrompts).toBe(5);
    expect(result.archivedPrompts).toBe(2);
    expect(result.totalVersions).toBe(12);
    expect(result.totalTestCases).toBe(8);
    expect(result.totalRuns).toBe(20);
  });

  it("includes recent prompts from repo", async () => {
    const prompts = [makePromptWithMeta(), makePromptWithMeta({ id: "00000000-0000-0000-0000-000000000002" })];
    const pool = makePool(
      {
        total_prompts: "2", active_prompts: "2", archived_prompts: "0",
        total_versions: "3", total_test_cases: "1", total_runs: "0",
      },
      [],
    );
    const repo = makePromptRepo(prompts);
    const service = createDashboardService(pool, repo);

    const result = await service.getSummary();
    expect(result.recentPrompts).toHaveLength(2);
    expect(result.recentPrompts[0]?.title).toBe("Mock Prompt");
  });

  it("maps recent runs correctly", async () => {
    const pool = makePool(
      {
        total_prompts: "1", active_prompts: "1", archived_prompts: "0",
        total_versions: "1", total_test_cases: "1", total_runs: "1",
      },
      [
        {
          id: "run-1",
          test_case_id: "tc-1",
          test_case_name: "Basic test",
          version_id: "v-1",
          version_number: "3",
          prompt_id: "p-1",
          prompt_title: "My Prompt",
          score: 4,
          actual_output: "Hello World",
          ran_at: new Date("2026-01-15T10:00:00Z"),
        },
      ],
    );
    const repo = makePromptRepo([]);
    const service = createDashboardService(pool, repo);

    const result = await service.getSummary();
    const run = result.recentRuns[0];
    expect(run).toBeDefined();
    expect(run!.testCaseName).toBe("Basic test");
    expect(run!.versionNumber).toBe(3);
    expect(run!.score).toBe(4);
    expect(run!.ranAt).toBe("2026-01-15T10:00:00.000Z");
  });

  it("returns zero counts when no data", async () => {
    const pool = makePool(
      {
        total_prompts: "0", active_prompts: "0", archived_prompts: "0",
        total_versions: "0", total_test_cases: "0", total_runs: "0",
      },
      [],
    );
    const repo = makePromptRepo([]);
    const service = createDashboardService(pool, repo);

    const result = await service.getSummary();
    expect(result.totalPrompts).toBe(0);
    expect(result.recentPrompts).toHaveLength(0);
    expect(result.recentRuns).toHaveLength(0);
  });
});

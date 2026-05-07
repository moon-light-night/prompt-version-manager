import { describe, it, expect, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { createTestCaseService } from "@/services/testCaseService";
import type { TestCaseRepository } from "@/repositories/testCaseRepository";
import type { PromptRepository } from "@/repositories/promptRepository";
import type { PromptTestCase, Prompt } from "@pvm/shared";

const PROMPT_ID = "00000000-0000-0000-0000-000000000001";
const TC_ID = "00000000-0000-0000-0000-000000000002";

function makeTestCase(overrides: Partial<PromptTestCase> = {}): PromptTestCase {
  return {
    id: TC_ID,
    promptId: PROMPT_ID,
    name: "Greeting test",
    inputValues: { name: "Alice" },
    expectedOutput: "Hello, Alice!",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makePrompt(overrides: Partial<Prompt> = {}): Prompt {
  return {
    id: PROMPT_ID,
    title: "Test Prompt",
    description: null,
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeMockTCRepo(overrides: Partial<TestCaseRepository> = {}): TestCaseRepository {
  return {
    findByPromptId: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(makeTestCase()),
    update: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue(false),
    ...overrides,
  };
}

function makeMockPromptRepo(overrides: Partial<PromptRepository> = {}): PromptRepository {
  return {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
    findById: vi.fn().mockResolvedValue(makePrompt()),
    create: vi.fn().mockResolvedValue(makePrompt()),
    update: vi.fn().mockResolvedValue(null),
    archive: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}

describe("TestCaseService.listByPrompt", () => {
  it("returns test cases for an existing prompt", async () => {
    const tc = makeTestCase();
    const tcRepo = makeMockTCRepo({ findByPromptId: vi.fn().mockResolvedValue([tc]) });
    const promptRepo = makeMockPromptRepo();
    const service = createTestCaseService(tcRepo, promptRepo);

    const result = await service.listByPrompt(PROMPT_ID);

    expect(result).toEqual([tc]);
    expect(tcRepo.findByPromptId).toHaveBeenCalledWith(PROMPT_ID, false);
  });

  it("throws NOT_FOUND when prompt does not exist", async () => {
    const promptRepo = makeMockPromptRepo({ findById: vi.fn().mockResolvedValue(null) });
    const service = createTestCaseService(makeMockTCRepo(), promptRepo);

    const error = await service.listByPrompt("missing-id").catch((e) => e);
    expect((error as TRPCError).code).toBe("NOT_FOUND");
  });

  it("passes includeArchived flag to repository", async () => {
    const tcRepo = makeMockTCRepo();
    const service = createTestCaseService(tcRepo, makeMockPromptRepo());

    await service.listByPrompt(PROMPT_ID, true);

    expect(tcRepo.findByPromptId).toHaveBeenCalledWith(PROMPT_ID, true);
  });
});

describe("TestCaseService.getById", () => {
  it("returns test case when it exists", async () => {
    const tc = makeTestCase();
    const tcRepo = makeMockTCRepo({ findById: vi.fn().mockResolvedValue(tc) });
    const service = createTestCaseService(tcRepo, makeMockPromptRepo());

    const result = await service.getById(TC_ID);

    expect(result).toEqual(tc);
  });

  it("throws NOT_FOUND when test case does not exist", async () => {
    const service = createTestCaseService(makeMockTCRepo(), makeMockPromptRepo());

    const error = await service.getById("missing").catch((e) => e);
    expect((error as TRPCError).code).toBe("NOT_FOUND");
  });
});

describe("TestCaseService.create", () => {
  it("creates test case for an existing prompt", async () => {
    const created = makeTestCase();
    const tcRepo = makeMockTCRepo({ create: vi.fn().mockResolvedValue(created) });
    const service = createTestCaseService(tcRepo, makeMockPromptRepo());

    const result = await service.create({
      promptId: PROMPT_ID,
      name: "Greeting test",
      inputValues: { name: "Alice" },
      expectedOutput: "Hello, Alice!",
    });

    expect(result).toEqual(created);
    expect(tcRepo.create).toHaveBeenCalledWith({
      promptId: PROMPT_ID,
      name: "Greeting test",
      inputValues: { name: "Alice" },
      expectedOutput: "Hello, Alice!",
    });
  });
});

describe("TestCaseService.update", () => {
  it("returns updated test case", async () => {
    const updated = makeTestCase({ name: "Updated" });
    const tcRepo = makeMockTCRepo({ update: vi.fn().mockResolvedValue(updated) });
    const service = createTestCaseService(tcRepo, makeMockPromptRepo());

    const result = await service.update({ id: TC_ID, name: "Updated" });

    expect(result.name).toBe("Updated");
  });

  it("throws NOT_FOUND when test case does not exist", async () => {
    const service = createTestCaseService(makeMockTCRepo(), makeMockPromptRepo());

    const error = await service.update({ id: "missing" }).catch((e) => e);
    expect((error as TRPCError).code).toBe("NOT_FOUND");
  });
});

describe("TestCaseService.delete", () => {
  it("returns { success: true } when test case deleted", async () => {
    const tcRepo = makeMockTCRepo({ delete: vi.fn().mockResolvedValue(true) });
    const service = createTestCaseService(tcRepo, makeMockPromptRepo());

    const result = await service.delete(TC_ID);

    expect(result).toEqual({ success: true });
  });

  it("throws NOT_FOUND when test case does not exist", async () => {
    const tcRepo = makeMockTCRepo({ delete: vi.fn().mockResolvedValue(false) });
    const service = createTestCaseService(tcRepo, makeMockPromptRepo());

    const error = await service.delete("missing").catch((e) => e);
    expect((error as TRPCError).code).toBe("NOT_FOUND");
  });
});

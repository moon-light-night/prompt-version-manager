import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { createPromptService } from "@/services/promptService";
import type { PromptRepository } from "@/repositories/promptRepository";
import type { Prompt, PromptWithMeta } from "@pvm/shared";

function makePrompt(overrides: Partial<Prompt> = {}): Prompt {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Test Prompt",
    description: null,
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makePromptWithMeta(overrides: Partial<PromptWithMeta> = {}): PromptWithMeta {
  return {
    ...makePrompt(),
    versionCount: 0,
    testCaseCount: 0,
    tags: [],
    latestVersion: null,
    ...overrides,
  };
}

function makeMockRepo(overrides: Partial<PromptRepository> = {}): PromptRepository {
  return {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(makePrompt()),
    update: vi.fn().mockResolvedValue(null),
    archive: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}

describe("PromptService.listPrompts", () => {
  it("returns paginated result", async () => {
    const items = [makePromptWithMeta()];
    const repo = makeMockRepo({
      findMany: vi.fn().mockResolvedValue(items),
      count: vi.fn().mockResolvedValue(1),
    });
    const service = createPromptService(repo);

    const result = await service.listPrompts({ limit: 20, offset: 0, sort: "updated_desc" });

    expect(result.items).toEqual(items);
    expect(result.total).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
    expect(repo.findMany).toHaveBeenCalledWith({ limit: 20, offset: 0, sort: "updated_desc" });
  });

  it("passes filters to repository", async () => {
    const repo = makeMockRepo();
    const service = createPromptService(repo);

    await service.listPrompts({ status: "active", search: "hello", limit: 10, offset: 5, sort: "updated_desc" });

    expect(repo.findMany).toHaveBeenCalledWith({
      status: "active",
      search: "hello",
      limit: 10,
      offset: 5,
      sort: "updated_desc",
    });
  });
});

describe("PromptService.getPromptById", () => {
  it("returns the prompt when found", async () => {
    const prompt = makePromptWithMeta();
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(prompt) });
    const service = createPromptService(repo);

    const result = await service.getPromptById(prompt.id);
    expect(result).toEqual(prompt);
  });

  it("throws NOT_FOUND when prompt does not exist", async () => {
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(null) });
    const service = createPromptService(repo);

    await expect(service.getPromptById("nonexistent-id")).rejects.toThrow(TRPCError);
    await expect(service.getPromptById("nonexistent-id")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});

describe("PromptService.createPrompt", () => {
  it("creates and returns a prompt", async () => {
    const createdPrompt = makePrompt({ title: "New Prompt" });
    const repo = makeMockRepo({ create: vi.fn().mockResolvedValue(createdPrompt) });
    const service = createPromptService(repo);

    const result = await service.createPrompt({ title: "New Prompt" });

    expect(result).toEqual(createdPrompt);
    expect(repo.create).toHaveBeenCalledWith({ title: "New Prompt", description: null });
  });

  it("passes description to repository", async () => {
    const repo = makeMockRepo();
    const service = createPromptService(repo);

    await service.createPrompt({ title: "Test", description: "Some desc" });

    expect(repo.create).toHaveBeenCalledWith({ title: "Test", description: "Some desc" });
  });
});

describe("PromptService.updatePrompt", () => {
  it("returns updated prompt", async () => {
    const updated = makePrompt({ title: "Updated Title" });
    const repo = makeMockRepo({ update: vi.fn().mockResolvedValue(updated) });
    const service = createPromptService(repo);

    const result = await service.updatePrompt({
      id: updated.id,
      title: "Updated Title",
    });
    expect(result).toEqual(updated);
  });

  it("throws NOT_FOUND when prompt does not exist", async () => {
    const repo = makeMockRepo({ update: vi.fn().mockResolvedValue(null) });
    const service = createPromptService(repo);

    await expect(
      service.updatePrompt({ id: "00000000-0000-0000-0000-000000000001", title: "X" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("PromptService.archivePrompt", () => {
  it("archives and returns the prompt", async () => {
    const archived = makePrompt({ status: "archived" });
    const repo = makeMockRepo({ archive: vi.fn().mockResolvedValue(archived) });
    const service = createPromptService(repo);

    const result = await service.archivePrompt(archived.id);
    expect(result.status).toBe("archived");
  });

  it("throws NOT_FOUND when prompt does not exist", async () => {
    const repo = makeMockRepo({ archive: vi.fn().mockResolvedValue(null) });
    const service = createPromptService(repo);

    await expect(
      service.archivePrompt("00000000-0000-0000-0000-000000000001"),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { createTagService } from "@/services/tagService";
import type { TagRepository } from "@/repositories/tagRepository";
import type { Tag } from "@pvm/shared";

function makeTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    name: "beta",
    color: "#ff0000",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeMockRepo(overrides: Partial<TagRepository> = {}): TagRepository {
  return {
    findMany: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(null),
    findByName: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(makeTag()),
    findTagsByPromptId: vi.fn().mockResolvedValue([]),
    attachTag: vi.fn().mockResolvedValue(undefined),
    detachTag: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("TagService.listTags", () => {
  it("returns all tags from repository", async () => {
    const tags = [makeTag({ name: "alpha" }), makeTag({ name: "beta", id: "00000000-0000-0000-0000-000000000002" })];
    const repo = makeMockRepo({ findMany: vi.fn().mockResolvedValue(tags) });
    const service = createTagService(repo);

    const result = await service.listTags();

    expect(result).toEqual(tags);
    expect(repo.findMany).toHaveBeenCalledTimes(1);
  });

  it("returns empty array when no tags exist", async () => {
    const service = createTagService(makeMockRepo());
    const result = await service.listTags();
    expect(result).toEqual([]);
  });
});

describe("TagService.createTag", () => {
  it("creates a tag when name is unique", async () => {
    const created = makeTag({ name: "new-tag" });
    const repo = makeMockRepo({
      findByName: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(created),
    });
    const service = createTagService(repo);

    const result = await service.createTag({ name: "new-tag", color: "#ff0000" });

    expect(result).toEqual(created);
    expect(repo.create).toHaveBeenCalledWith({ name: "new-tag", color: "#ff0000" });
  });

  it("throws CONFLICT when tag name already exists", async () => {
    const repo = makeMockRepo({ findByName: vi.fn().mockResolvedValue(makeTag()) });
    const service = createTagService(repo);

    await expect(service.createTag({ name: "beta" })).rejects.toThrow(TRPCError);
    const error = await service.createTag({ name: "beta" }).catch((e: TRPCError) => e);
    expect((error as TRPCError).code).toBe("CONFLICT");
  });

  it("stores null color when not provided", async () => {
    const repo = makeMockRepo({ findByName: vi.fn().mockResolvedValue(null) });
    const service = createTagService(repo);

    await service.createTag({ name: "no-color" });

    expect(repo.create).toHaveBeenCalledWith({ name: "no-color", color: null });
  });
});

describe("TagService.getTagsByPromptId", () => {
  it("returns tags for given promptId", async () => {
    const tags = [makeTag()];
    const repo = makeMockRepo({ findTagsByPromptId: vi.fn().mockResolvedValue(tags) });
    const service = createTagService(repo);

    const result = await service.getTagsByPromptId("prompt-123");

    expect(result).toEqual(tags);
    expect(repo.findTagsByPromptId).toHaveBeenCalledWith("prompt-123");
  });
});

describe("TagService.attachTag", () => {
  it("attaches tag when tag exists", async () => {
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(makeTag()) });
    const service = createTagService(repo);

    await expect(service.attachTag("prompt-123", "tag-456")).resolves.toBeUndefined();
    expect(repo.attachTag).toHaveBeenCalledWith("prompt-123", "tag-456");
  });

  it("throws NOT_FOUND when tag does not exist", async () => {
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(null) });
    const service = createTagService(repo);

    const error = await service.attachTag("prompt-123", "missing-tag").catch((e) => e);
    expect((error as TRPCError).code).toBe("NOT_FOUND");
    expect(repo.attachTag).not.toHaveBeenCalled();
  });
});

describe("TagService.detachTag", () => {
  it("calls repo.detachTag with correct args", async () => {
    const repo = makeMockRepo();
    const service = createTagService(repo);

    await service.detachTag("prompt-123", "tag-456");

    expect(repo.detachTag).toHaveBeenCalledWith("prompt-123", "tag-456");
  });
});

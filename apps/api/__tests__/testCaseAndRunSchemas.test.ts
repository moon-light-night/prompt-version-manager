import { describe, it, expect } from "vitest";
import {
  CreateTestCaseInput,
  UpdateTestCaseInput
} from "@/schemas/testCaseSchemas";
import { CreateRunInput, ListRunsByPromptInput } from "@/schemas/promptRunSchemas";

describe("CreateTestCaseInput", () => {
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";

  it("accepts valid input with required fields only", () => {
    const result = CreateTestCaseInput.safeParse({
      promptId: validUuid,
      name: "Basic greeting test",
    });
    expect(result.success).toBe(true);
    expect(result.data?.inputValues).toEqual({});
  });

  it("accepts full input with inputValues and expectedOutput", () => {
    const result = CreateTestCaseInput.safeParse({
      promptId: validUuid,
      name: "Full test",
      inputValues: { name: "Alice", lang: "French" },
      expectedOutput: "Bonjour, Alice!",
    });
    expect(result.success).toBe(true);
    expect(result.data?.inputValues).toEqual({ name: "Alice", lang: "French" });
  });

  it("rejects empty name", () => {
    const result = CreateTestCaseInput.safeParse({ promptId: validUuid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name over 255 characters", () => {
    const result = CreateTestCaseInput.safeParse({
      promptId: validUuid,
      name: "a".repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID promptId", () => {
    const result = CreateTestCaseInput.safeParse({ promptId: "not-a-uuid", name: "Test" });
    expect(result.success).toBe(false);
  });
});

describe("UpdateTestCaseInput", () => {
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";

  it("accepts partial update with just name", () => {
    const result = UpdateTestCaseInput.safeParse({ id: validUuid, name: "Renamed" });
    expect(result.success).toBe(true);
  });

  it("accepts status change to archived", () => {
    const result = UpdateTestCaseInput.safeParse({ id: validUuid, status: "archived" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = UpdateTestCaseInput.safeParse({ id: validUuid, status: "deleted" });
    expect(result.success).toBe(false);
  });
});

describe("CreateRunInput", () => {
  const uuid1 = "123e4567-e89b-12d3-a456-426614174001";
  const uuid2 = "123e4567-e89b-12d3-a456-426614174002";

  it("accepts valid run with required fields only", () => {
    const result = CreateRunInput.safeParse({
      testCaseId: uuid1,
      versionId: uuid2,
      actualOutput: "Bonjour, Alice!",
    });
    expect(result.success).toBe(true);
    expect(result.data?.score).toBeUndefined();
    expect(result.data?.notes).toBeUndefined();
  });

  it("accepts run with score and notes", () => {
    const result = CreateRunInput.safeParse({
      testCaseId: uuid1,
      versionId: uuid2,
      actualOutput: "Output text",
      score: 4,
      notes: "Looks good",
    });
    expect(result.success).toBe(true);
    expect(result.data?.score).toBe(4);
  });

  it("rejects score = 0 (below minimum)", () => {
    const result = CreateRunInput.safeParse({
      testCaseId: uuid1,
      versionId: uuid2,
      actualOutput: "Output",
      score: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects score = 6 (above maximum)", () => {
    const result = CreateRunInput.safeParse({
      testCaseId: uuid1,
      versionId: uuid2,
      actualOutput: "Output",
      score: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty actualOutput", () => {
    const result = CreateRunInput.safeParse({
      testCaseId: uuid1,
      versionId: uuid2,
      actualOutput: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("ListRunsByPromptInput", () => {
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";

  it("defaults limit=50 and offset=0", () => {
    const result = ListRunsByPromptInput.safeParse({ promptId: validUuid });
    expect(result.success).toBe(true);
    expect(result.data?.limit).toBe(50);
    expect(result.data?.offset).toBe(0);
  });

  it("accepts custom pagination", () => {
    const result = ListRunsByPromptInput.safeParse({
      promptId: validUuid,
      limit: 10,
      offset: 20,
    });
    expect(result.success).toBe(true);
    expect(result.data?.limit).toBe(10);
    expect(result.data?.offset).toBe(20);
  });

  it("rejects limit = 0", () => {
    const result = ListRunsByPromptInput.safeParse({ promptId: validUuid, limit: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative offset", () => {
    const result = ListRunsByPromptInput.safeParse({ promptId: validUuid, offset: -1 });
    expect(result.success).toBe(false);
  });
});

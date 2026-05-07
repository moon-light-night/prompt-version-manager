import { describe, it, expect } from "vitest";
import { CreatePromptInput, UpdatePromptInput, ListPromptsInput } from "@/schemas/promptSchemas";
import { CreateVersionInput } from "@/schemas/versionSchemas";
import { CreateTagInput } from "@/schemas/tagSchemas";

describe("CreatePromptInput", () => {
  it("accepts valid input", () => {
    const result = CreatePromptInput.safeParse({ title: "My Prompt", description: "desc" });
    expect(result.success).toBe(true);
  });

  it("requires non-empty title", () => {
    const result = CreatePromptInput.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 chars", () => {
    const result = CreatePromptInput.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("allows null description", () => {
    const result = CreatePromptInput.safeParse({ title: "Test", description: null });
    expect(result.success).toBe(true);
  });
});

describe("UpdatePromptInput", () => {
  it("accepts valid UUID", () => {
    const result = UpdatePromptInput.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Updated",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID id", () => {
    const result = UpdatePromptInput.safeParse({ id: "not-a-uuid", title: "Updated" });
    expect(result.success).toBe(false);
  });
});

describe("ListPromptsInput", () => {
  it("applies defaults for limit and offset", () => {
    const result = ListPromptsInput.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
      expect(result.data.offset).toBe(0);
    }
  });

  it("accepts valid status filter", () => {
    const result = ListPromptsInput.safeParse({ status: "active" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = ListPromptsInput.safeParse({ status: "deleted" });
    expect(result.success).toBe(false);
  });

  it("rejects limit over 100", () => {
    const result = ListPromptsInput.safeParse({ limit: 200 });
    expect(result.success).toBe(false);
  });
});

describe("CreateVersionInput", () => {
  it("accepts valid input", () => {
    const result = CreateVersionInput.safeParse({
      promptId: "123e4567-e89b-12d3-a456-426614174000",
      content: "Hello {{name}}!",
      label: "Initial version",
    });
    expect(result.success).toBe(true);
  });

  it("requires non-empty content", () => {
    const result = CreateVersionInput.safeParse({
      promptId: "123e4567-e89b-12d3-a456-426614174000",
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("allows null label", () => {
    const result = CreateVersionInput.safeParse({
      promptId: "123e4567-e89b-12d3-a456-426614174000",
      content: "Hello",
      label: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("CreateTagInput", () => {
  it("accepts valid tag with hex color", () => {
    const result = CreateTagInput.safeParse({ name: "frontend", color: "#6366f1" });
    expect(result.success).toBe(true);
  });

  it("accepts uppercase hex color", () => {
    const result = CreateTagInput.safeParse({ name: "backend", color: "#FF5733" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid hex color", () => {
    const result = CreateTagInput.safeParse({ name: "test", color: "red" });
    expect(result.success).toBe(false);
  });

  it("rejects empty tag name", () => {
    const result = CreateTagInput.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("allows no color", () => {
    const result = CreateTagInput.safeParse({ name: "infrastructure" });
    expect(result.success).toBe(true);
  });
});

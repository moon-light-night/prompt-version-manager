import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { substituteVariables } from "@pvm/shared";
import {
  testCaseFormSchema,
  recordToFields,
  fieldsToRecord,
} from "@/components/testCases/TestCaseForm";
import { runFormSchema } from "@/components/runs/RunForm";
import { RenderedPromptPreview } from "@/components/testCases/RenderedPromptPreview";

describe("testCaseFormSchema", () => {
  it("accepts a valid test case", () => {
    const result = testCaseFormSchema.safeParse({
      name: "Basic test",
      inputValues: [{ key: "user", value: "Alice" }],
      expectedOutput: "Hello Alice",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = testCaseFormSchema.safeParse({
      name: "",
      inputValues: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain("name");
  });

  it("rejects name longer than 255 characters", () => {
    const result = testCaseFormSchema.safeParse({
      name: "x".repeat(256),
      inputValues: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty inputValues", () => {
    const result = testCaseFormSchema.safeParse({ name: "Empty", inputValues: [] });
    expect(result.success).toBe(true);
  });

  it("accepts missing expectedOutput", () => {
    const result = testCaseFormSchema.safeParse({ name: "No expected", inputValues: [] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expectedOutput).toBeUndefined();
    }
  });
});

describe("fieldsToRecord", () => {
  it("converts array of key-value fields to a record", () => {
    const fields = [
      { key: "foo", value: "bar" },
      { key: "baz", value: "qux" },
    ];
    expect(fieldsToRecord(fields)).toEqual({ foo: "bar", baz: "qux" });
  });

  it("returns empty object for empty array", () => {
    expect(fieldsToRecord([])).toEqual({});
  });

  it("last duplicate key wins", () => {
    expect(fieldsToRecord([{ key: "a", value: "1" }, { key: "a", value: "2" }])).toEqual({ a: "2" });
  });
});

describe("recordToFields", () => {
  it("converts record to array of {key, value}", () => {
    const fields = recordToFields({ name: "Alice", role: "admin" });
    expect(fields).toHaveLength(2);
    expect(fields).toContainEqual({ key: "name", value: "Alice" });
    expect(fields).toContainEqual({ key: "role", value: "admin" });
  });

  it("returns empty array for empty record", () => {
    expect(recordToFields({})).toEqual([]);
  });
});

describe("runFormSchema", () => {
  it("accepts a valid run", () => {
    const result = runFormSchema.safeParse({
      actualOutput: "Output text",
      score: 4,
      notes: "Looked good",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty actualOutput", () => {
    const result = runFormSchema.safeParse({ actualOutput: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain("actualOutput");
  });

  it("rejects score < 1", () => {
    const result = runFormSchema.safeParse({ actualOutput: "x", score: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects score > 5", () => {
    const result = runFormSchema.safeParse({ actualOutput: "x", score: 6 });
    expect(result.success).toBe(false);
  });

  it("accepts score from 1 to 5", () => {
    for (const score of [1, 2, 3, 4, 5]) {
      const result = runFormSchema.safeParse({ actualOutput: "x", score });
      expect(result.success).toBe(true);
    }
  });

  it("accepts missing score (nullish)", () => {
    const result = runFormSchema.safeParse({ actualOutput: "x" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.score == null).toBe(true);
    }
  });

  it("rejects notes longer than 2000 characters", () => {
    const result = runFormSchema.safeParse({
      actualOutput: "x",
      notes: "n".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("substituteVariables", () => {
  it("substitutes known variables", () => {
    expect(substituteVariables("Hi {{name}}", { name: "Alice" })).toBe("Hi Alice");
  });

  it("leaves unknown variables as-is", () => {
    expect(substituteVariables("Hi {{unknown}}", {})).toBe("Hi {{unknown}}");
  });

  it("handles empty inputValues", () => {
    expect(substituteVariables("{{a}} {{b}}", {})).toBe("{{a}} {{b}}");
  });

  it("substitutes multiple occurrences", () => {
    expect(substituteVariables("{{x}} {{x}}", { x: "Y" })).toBe("Y Y");
  });
});

describe("RenderedPromptPreview", () => {
  it("renders substituted prompt content", () => {
    render(
      <RenderedPromptPreview
        promptContent="Hello {{name}}"
        inputValues={{ name: "World" }}
      />
    );
    expect(screen.getByTestId("rendered-prompt-preview")).toBeDefined();
    expect(screen.getByText(/Hello World/)).toBeDefined();
  });

  it("shows empty state when no promptContent is given", () => {
    render(<RenderedPromptPreview promptContent="" inputValues={{}} />);
    const preview = screen.getByTestId("rendered-prompt-preview");
    expect(preview).toBeDefined();
  });

  it("renders unresolved variables unchanged", () => {
    render(
      <RenderedPromptPreview
        promptContent="{{missing}}"
        inputValues={{}}
      />
    );
    expect(screen.getByText(/\{\{missing\}\}/)).toBeDefined();
  });
});

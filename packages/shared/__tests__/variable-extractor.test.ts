import { describe, it, expect } from "vitest";
import {
  extractVariables,
  substituteVariables,
} from "../src/utils/variable-extractor.js";

describe("extractVariables", () => {
  it("returns empty array when no variables present", () => {
    expect(extractVariables("No variables here.")).toEqual([]);
  });

  it("extracts a single variable", () => {
    expect(extractVariables("Hello, {{name}}!")).toEqual(["name"]);
  });

  it("extracts multiple variables in order", () => {
    expect(
      extractVariables("Translate '{{text}}' from {{source}} to {{target}}."),
    ).toEqual(["text", "source", "target"]);
  });

  it("deduplicates repeated variables", () => {
    expect(extractVariables("{{lang}} and {{lang}} again")).toEqual(["lang"]);
  });

  it("trims whitespace inside braces", () => {
    expect(extractVariables("Hello {{ name }} and {{ lang }}")).toEqual([
      "name",
      "lang",
    ]);
  });

  it("ignores invalid variable names (starting with digit)", () => {
    expect(extractVariables("Bad: {{1invalid}}")).toEqual([]);
  });

  it("handles underscores and numbers in names", () => {
    expect(extractVariables("{{user_input_1}} is valid")).toEqual([
      "user_input_1",
    ]);
  });

  it("returns empty array for empty string", () => {
    expect(extractVariables("")).toEqual([]);
  });
});

describe("substituteVariables", () => {
  it("substitutes a single variable", () => {
    expect(substituteVariables("Hello, {{name}}!", { name: "Alice" })).toBe(
      "Hello, Alice!",
    );
  });

  it("substitutes multiple variables", () => {
    const result = substituteVariables("{{greeting}}, {{name}}!", {
      greeting: "Hi",
      name: "Bob",
    });
    expect(result).toBe("Hi, Bob!");
  });

  it("leaves unknown variables as-is", () => {
    expect(substituteVariables("Hello, {{unknown}}!", {})).toBe(
      "Hello, {{unknown}}!",
    );
  });

  it("handles empty values record", () => {
    expect(substituteVariables("{{a}} and {{b}}", {})).toBe(
      "{{a}} and {{b}}",
    );
  });
});

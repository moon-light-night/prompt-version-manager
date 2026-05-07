import { describe, it, expect } from "vitest";
import {
  extractVariables,
  substituteVariables,
} from "../src/utils/variable-extractor.js";

function renderPrompt(
  template: string,
  values: Record<string, string>,
): { rendered: string; variables: string[]; missing: string[] } {
  const variables = extractVariables(template);
  const rendered = substituteVariables(template, values);
  const missing = variables.filter((v) => !(v in values) || values[v] === "");
  return { rendered, variables, missing };
}

describe("renderPrompt — happy path", () => {
  it("renders a simple template with all variables provided", () => {
    const { rendered, missing } = renderPrompt(
      "Hello, {{name}}! Your role is {{role}}.",
      { name: "Alice", role: "admin" },
    );
    expect(rendered).toBe("Hello, Alice! Your role is admin.");
    expect(missing).toEqual([]);
  });

  it("detects all variables in the template", () => {
    const { variables } = renderPrompt(
      "Translate '{{text}}' from {{source}} to {{target}}.",
      {},
    );
    expect(variables).toEqual(["text", "source", "target"]);
  });

  it("renders correctly when variable appears multiple times", () => {
    const { rendered } = renderPrompt("{{name}} is {{name}}.", { name: "Bob" });
    expect(rendered).toBe("Bob is Bob.");
  });

  it("returns empty missing array when all vars are filled", () => {
    const { missing } = renderPrompt("{{a}} and {{b}}", { a: "x", b: "y" });
    expect(missing).toEqual([]);
  });
});

describe("renderPrompt — missing variables", () => {
  it("leaves unsubstituted variables as-is in rendered output", () => {
    const { rendered } = renderPrompt("Hello, {{name}}!", {});
    expect(rendered).toBe("Hello, {{name}}!");
  });

  it("reports missing variables", () => {
    const { missing } = renderPrompt("{{greeting}}, {{name}}!", {
      greeting: "Hi",
    });
    expect(missing).toContain("name");
    expect(missing).not.toContain("greeting");
  });

  it("reports all variables as missing when values is empty", () => {
    const { variables, missing } = renderPrompt("{{a}}, {{b}}, {{c}}", {});
    expect(missing).toEqual(variables);
  });

  it("treats empty-string value as missing", () => {
    const { missing } = renderPrompt("{{name}}", { name: "" });
    expect(missing).toContain("name");
  });
});

describe("renderPrompt — edge cases", () => {
  it("returns original text unchanged when template has no variables", () => {
    const template = "No variables here.";
    const { rendered, variables, missing } = renderPrompt(template, {});
    expect(rendered).toBe(template);
    expect(variables).toEqual([]);
    expect(missing).toEqual([]);
  });

  it("handles whitespace inside braces", () => {
    const { rendered } = renderPrompt("Hello, {{ name }}!", { name: "Carol" });
    expect(rendered).toBe("Hello, Carol!");
  });

  it("ignores invalid variable syntax", () => {
    const { variables } = renderPrompt("{{123}} {{foo-bar}} {{_ok}}", {});
    expect(variables).toEqual(["_ok"]);
  });

  it("handles multi-line templates", () => {
    const template = "System: {{system_prompt}}\nUser: {{user_message}}";
    const { rendered } = renderPrompt(template, {
      system_prompt: "You are helpful.",
      user_message: "What is 2+2?",
    });
    expect(rendered).toBe("System: You are helpful.\nUser: What is 2+2?");
  });

  it("handles template with only whitespace", () => {
    const { rendered, variables } = renderPrompt("   ", {});
    expect(rendered).toBe("   ");
    expect(variables).toEqual([]);
  });
});

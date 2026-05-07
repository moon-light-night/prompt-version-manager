import { describe, it, expect } from "vitest";
import { extractVariables, diffStrings } from "@pvm/shared";

describe("extractVariables", () => {
  it("returns empty array for content with no variables", () => {
    expect(extractVariables("Hello, world!")).toEqual([]);
  });

  it("extracts a single variable", () => {
    expect(extractVariables("Hello, {{name}}!")).toEqual(["name"]);
  });

  it("extracts multiple distinct variables in order", () => {
    expect(extractVariables("{{greeting}}, {{name}}! You are {{role}}.")).toEqual([
      "greeting",
      "name",
      "role",
    ]);
  });

  it("deduplicates repeated variables", () => {
    expect(extractVariables("{{x}} and {{x}} again")).toEqual(["x"]);
  });

  it("handles whitespace inside braces", () => {
    expect(extractVariables("{{ name }} and {{ age }}")).toEqual(["name", "age"]);
  });

  it("ignores invalid variable syntax (numbers, hyphens)", () => {
    expect(extractVariables("{{123}} and {{foo-bar}}")).toEqual([]);
  });

  it("allows underscores and alphanumerics", () => {
    expect(extractVariables("{{user_name}} {{item2}} {{_private}}")).toEqual([
      "user_name",
      "item2",
      "_private",
    ]);
  });

  it("returns empty array for empty string", () => {
    expect(extractVariables("")).toEqual([]);
  });
});

describe("diffStrings for version comparison", () => {
  it("compares identical content — all unchanged", () => {
    const result = diffStrings("Hello\nWorld", "Hello\nWorld");
    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(0);
    expect(result.unchangedCount).toBe(2);
  });

  it("detects added line", () => {
    const result = diffStrings("Hello", "Hello\nWorld");
    expect(result.addedCount).toBe(1);
    expect(result.removedCount).toBe(0);
    expect(result.unchangedCount).toBe(1);
  });

  it("detects removed line", () => {
    const result = diffStrings("Hello\nWorld", "Hello");
    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(1);
    expect(result.unchangedCount).toBe(1);
  });

  it("detects changed line (one removed + one added)", () => {
    const result = diffStrings("foo", "bar");
    expect(result.addedCount).toBe(1);
    expect(result.removedCount).toBe(1);
    expect(result.unchangedCount).toBe(0);
  });

  it("handles empty strings", () => {
    const result = diffStrings("", "");
    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(0);
    expect(result.unchangedCount).toBe(0);
  });

  it("handles old empty — all added", () => {
    const result = diffStrings("", "line1\nline2");
    expect(result.addedCount).toBe(2);
    expect(result.removedCount).toBe(0);
  });

  it("returns correct line content in result", () => {
    const result = diffStrings("old line", "new line");
    const removed = result.lines.find((l) => l.type === "removed");
    const added = result.lines.find((l) => l.type === "added");
    expect(removed?.content).toBe("old line");
    expect(added?.content).toBe("new line");
  });
});

describe("variable delta for version comparison", () => {
  function getVariableDelta(varsA: string[], varsB: string[]) {
    const setA = new Set(varsA);
    const setB = new Set(varsB);
    return {
      addedVariables: varsB.filter((v) => !setA.has(v)),
      removedVariables: varsA.filter((v) => !setB.has(v)),
    };
  }

  it("detects new variable added in version B", () => {
    const { addedVariables, removedVariables } = getVariableDelta(
      ["name"],
      ["name", "role"],
    );
    expect(addedVariables).toEqual(["role"]);
    expect(removedVariables).toEqual([]);
  });

  it("detects variable removed in version B", () => {
    const { addedVariables, removedVariables } = getVariableDelta(
      ["name", "greeting"],
      ["name"],
    );
    expect(addedVariables).toEqual([]);
    expect(removedVariables).toEqual(["greeting"]);
  });

  it("detects both added and removed", () => {
    const { addedVariables, removedVariables } = getVariableDelta(
      ["name", "greeting"],
      ["name", "farewell"],
    );
    expect(addedVariables).toEqual(["farewell"]);
    expect(removedVariables).toEqual(["greeting"]);
  });

  it("returns empty when variable set is unchanged", () => {
    const { addedVariables, removedVariables } = getVariableDelta(
      ["name"],
      ["name"],
    );
    expect(addedVariables).toEqual([]);
    expect(removedVariables).toEqual([]);
  });
});

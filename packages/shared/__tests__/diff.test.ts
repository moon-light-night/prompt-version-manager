import { describe, it, expect } from "vitest";
import { diffStrings } from "../src/utils/diff.js";

describe("diffStrings", () => {
  it("returns empty diff for identical strings", () => {
    const result = diffStrings("hello\nworld", "hello\nworld");
    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(0);
    expect(result.unchangedCount).toBe(2);
  });

  it("detects added lines", () => {
    const result = diffStrings("line1", "line1\nline2");
    expect(result.addedCount).toBe(1);
    expect(result.removedCount).toBe(0);
    expect(result.lines.find((l) => l.type === "added")?.content).toBe(
      "line2",
    );
  });

  it("detects removed lines", () => {
    const result = diffStrings("line1\nline2", "line1");
    expect(result.removedCount).toBe(1);
    expect(result.addedCount).toBe(0);
    expect(result.lines.find((l) => l.type === "removed")?.content).toBe(
      "line2",
    );
  });

  it("handles completely different strings", () => {
    const result = diffStrings("old content", "new content");
    expect(result.addedCount).toBe(1);
    expect(result.removedCount).toBe(1);
  });

  it("handles empty old string", () => {
    const result = diffStrings("", "new line");
    expect(result.addedCount).toBe(1);
    expect(result.removedCount).toBe(0);
  });

  it("handles empty new string", () => {
    const result = diffStrings("old line", "");
    expect(result.removedCount).toBe(1);
    expect(result.addedCount).toBe(0);
  });

  it("assigns correct line numbers to added lines", () => {
    const result = diffStrings("a", "a\nb");
    const addedLine = result.lines.find((l) => l.type === "added");
    expect(addedLine?.lineNumber).toBe(2);
  });

  it("assigns null line number to removed lines", () => {
    const result = diffStrings("a\nb", "a");
    const removedLine = result.lines.find((l) => l.type === "removed");
    expect(removedLine?.lineNumber).toBeNull();
  });
});

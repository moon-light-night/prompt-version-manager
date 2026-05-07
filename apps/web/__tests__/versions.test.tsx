import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { extractVariables, diffStrings } from "@pvm/shared";
import { versionFormSchema } from "@/components/versions/VersionForm";
import { DiffViewer } from "@/components/versions/DiffViewer";
import { VariablePill } from "@/components/versions/VariablePill";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer, {
  setCompareVersionIds,
  clearCompareVersionIds,
} from "@/store/slices/uiSlice";

describe("extractVariables (frontend)", () => {
  it("extracts variables from prompt content", () => {
    expect(extractVariables("Hi {{name}}, your role is {{role}}.")).toEqual([
      "name",
      "role",
    ]);
  });

  it("deduplicates variables", () => {
    expect(extractVariables("{{x}} and {{x}}")).toEqual(["x"]);
  });

  it("returns empty for no variables", () => {
    expect(extractVariables("Plain text")).toEqual([]);
  });

  it("ignores invalid syntax", () => {
    expect(extractVariables("{{}} {{ }} {{123}} {{foo-bar}}")).toEqual([]);
  });
});

describe("versionFormSchema", () => {
  it("accepts valid content", () => {
    const result = versionFormSchema.safeParse({ content: "Hello {{name}}" });
    expect(result.success).toBe(true);
  });

  it("accepts optional label", () => {
    const result = versionFormSchema.safeParse({
      content: "Hello",
      label: "Fixed grammar",
    });
    expect(result.success).toBe(true);
    expect(result.data?.label).toBe("Fixed grammar");
  });

  it("rejects label exceeding 200 characters", () => {
    const result = versionFormSchema.safeParse({
      content: "Hello",
      label: "a".repeat(201),
    });
    expect(result.success).toBe(false);
    const msg = result.error?.issues.find((i) => i.path.includes("label"))?.message;
    expect(msg).toMatch(/200/);
  });
});

describe("compareVersionIds Redux state", () => {
  function makeStore() {
    return configureStore({ reducer: { ui: uiReducer } });
  }

  it("starts with null compareVersionIds", () => {
    const store = makeStore();
    expect(store.getState().ui.compareVersionIds).toBeNull();
  });

  it("sets compareVersionIds to a pair", () => {
    const store = makeStore();
    store.dispatch(setCompareVersionIds(["id-a", "id-b"]));
    expect(store.getState().ui.compareVersionIds).toEqual(["id-a", "id-b"]);
  });

  it("clears compareVersionIds", () => {
    const store = makeStore();
    store.dispatch(setCompareVersionIds(["id-a", "id-b"]));
    store.dispatch(clearCompareVersionIds());
    expect(store.getState().ui.compareVersionIds).toBeNull();
  });
});


describe("DiffViewer", () => {
  it("renders diff viewer element", () => {
    const diff = diffStrings("old line", "new line");
    render(<DiffViewer diff={diff} />);
    expect(screen.getByTestId("diff-viewer")).toBeInTheDocument();
  });

  it("shows summary counts", () => {
    const diff = diffStrings("old line", "new line");
    render(<DiffViewer diff={diff} />);
    expect(screen.getByText(/\+1 added/)).toBeInTheDocument();
    expect(screen.getByText(/−1 removed/)).toBeInTheDocument();
  });

  it("shows 'No changes' message for identical content", () => {
    const diff = diffStrings("same", "same");
    render(<DiffViewer diff={diff} />);
    expect(screen.getByText(/no changes/i)).toBeInTheDocument();
  });

  it("renders added and removed lines", () => {
    const diff = diffStrings("old", "new");
    render(<DiffViewer diff={diff} />);
    const addedLines = document.querySelectorAll("[data-line-type='added']");
    const removedLines = document.querySelectorAll("[data-line-type='removed']");
    expect(addedLines.length).toBe(1);
    expect(removedLines.length).toBe(1);
  });
});

describe("VariablePill", () => {
  it("renders variable name in double braces", () => {
    render(<VariablePill name="user_name" />);
    expect(screen.getByTestId("variable-pill")).toHaveTextContent("{{user_name}}");
  });

  it("applies added variant styling class", () => {
    render(<VariablePill name="foo" variant="added" />);
    const pill = screen.getByTestId("variable-pill");
    expect(pill.className).toMatch(/green/);
  });

  it("applies removed variant with strikethrough", () => {
    render(<VariablePill name="bar" variant="removed" />);
    const pill = screen.getByTestId("variable-pill");
    expect(pill.className).toMatch(/red/);
    expect(pill.className).toMatch(/line-through/);
  });
});

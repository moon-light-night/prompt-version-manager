import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RunCard } from "@/components/runs/RunCard";
import type { PromptRun } from "@pvm/shared";

function makeRun(overrides: Partial<PromptRun> = {}): PromptRun {
  return {
    id: "run-1",
    testCaseId: "tc-1",
    versionId: "v-1",
    actualOutput: "Hello, Alice!",
    score: 4,
    notes: null,
    latencyMs: null,
    model: null,
    status: "completed",
    ranAt: new Date("2026-01-01T10:00:00Z").toISOString(),
    ...overrides,
  };
}

describe("RunCard", () => {
  it("renders without crashing", () => {
    render(<RunCard run={makeRun()} />);
    expect(screen.getByTestId("run-card")).toBeTruthy();
  });

  it("shows actualOutput", () => {
    render(<RunCard run={makeRun({ actualOutput: "Test response here" })} />);
    expect(screen.getByText("Test response here")).toBeTruthy();
  });

  it("displays score when provided", () => {
    render(<RunCard run={makeRun({ score: 5 })} />);
    expect(screen.getByTestId("run-score")).toBeTruthy();
    expect(screen.getByText(/5\/5/)).toBeTruthy();
    expect(screen.getByText(/excellent/i)).toBeTruthy();
  });

  it("shows testCaseName when provided", () => {
    render(<RunCard run={makeRun()} testCaseName="My test case" />);
    expect(screen.getByText("My test case")).toBeTruthy();
  });

  it("shows versionLabel when provided", () => {
    render(<RunCard run={makeRun()} versionLabel="v3 · Fixed tone" />);
    expect(screen.getByText("v3 · Fixed tone")).toBeTruthy();
  });

  it("shows Error badge when status is error", () => {
    render(<RunCard run={makeRun({ status: "error" })} />);
    expect(screen.getByText("Error")).toBeTruthy();
  });

  it("does not show Error badge when status is completed", () => {
    render(<RunCard run={makeRun({ status: "completed" })} />);
    expect(screen.queryByText("Error")).toBeNull();
  });

  it("renders notes when provided", () => {
    render(<RunCard run={makeRun({ notes: "Looks great!" })} />);
    expect(screen.getByText("Looks great!")).toBeTruthy();
  });

  it("handles missing score — no score widget", () => {
    render(<RunCard run={makeRun({ score: null })} />);
    expect(screen.getByTestId("run-card")).toBeTruthy();
    expect(screen.queryByText(/excellent/i)).toBeNull();
  });
});

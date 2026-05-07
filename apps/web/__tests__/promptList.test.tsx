import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/store/slices/uiSlice";
import { PromptList } from "@/components/prompts/PromptList";
import type { PromptWithMeta } from "@pvm/shared";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/prompts",
}));

vi.mock("@/hooks/usePrompts", () => ({
  useArchivePrompt: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

function makeStore() {
  return configureStore({
    reducer: { ui: uiReducer },
  });
}

function makePrompt(overrides: Partial<PromptWithMeta> = {}): PromptWithMeta {
  return {
    id: "1",
    title: "Test Prompt",
    description: null,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versionCount: 2,
    testCaseCount: 1,
    latestVersion: null,
    tags: [],
    ...overrides,
  };
}

function renderList(props: React.ComponentProps<typeof PromptList>) {
  return render(
    <Provider store={makeStore()}>
      <PromptList {...props} />
    </Provider>,
  );
}

describe("PromptList", () => {
  it("renders loading skeletons when isLoading=true", () => {
    const { container } = renderList({ isLoading: true, isError: false });
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("renders error state when isError=true", () => {
    renderList({ isLoading: false, isError: true });
    expect(screen.getByTestId("error-state")).toBeTruthy();
    expect(screen.getByText(/failed to load prompts/i)).toBeTruthy();
  });

  it("calls onRetry when retry button clicked in error state", () => {
    const onRetry = vi.fn();
    renderList({ isLoading: false, isError: true, onRetry });
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders empty state when prompts array is empty", () => {
    renderList({ isLoading: false, isError: false, prompts: [] });
    expect(screen.getByTestId("empty-state")).toBeTruthy();
    expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
  });

  it("renders empty state when prompts is undefined", () => {
    renderList({ isLoading: false, isError: false, prompts: undefined });
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  it("calls onCreateClick when empty state action clicked", () => {
    const onCreateClick = vi.fn();
    renderList({
      isLoading: false,
      isError: false,
      prompts: [],
      onCreateClick,
    });
    fireEvent.click(screen.getByRole("button", { name: /create your first prompt/i }));
    expect(onCreateClick).toHaveBeenCalledTimes(1);
  });

  it("renders prompt cards when prompts are provided", () => {
    const prompts = [
      makePrompt({ id: "1", title: "First Prompt" }),
      makePrompt({ id: "2", title: "Second Prompt" }),
    ];
    renderList({ isLoading: false, isError: false, prompts });
    expect(screen.getByTestId("prompt-list")).toBeTruthy();
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);
    expect(screen.getByText("First Prompt")).toBeTruthy();
    expect(screen.getByText("Second Prompt")).toBeTruthy();
  });

  it("shows version and test case counts on prompt cards", () => {
    const prompts = [makePrompt({ versionCount: 3, testCaseCount: 5 })];
    renderList({ isLoading: false, isError: false, prompts });
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
  });
});

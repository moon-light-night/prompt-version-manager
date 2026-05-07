import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import uiReducer from "@/store/slices/uiSlice";
import { PromptFilters } from "@/components/prompts/PromptFilters";

vi.mock("@/lib/trpc", () => ({
  trpcClient: {
    tag: {
      list: { query: vi.fn().mockResolvedValue([]) },
    },
  },
}));

function makeStore(preloaded?: Partial<Parameters<typeof configureStore>[0]["preloadedState"]>) {
  return configureStore({
    reducer: { ui: uiReducer },
    preloadedState: preloaded as Parameters<typeof configureStore>[0]["preloadedState"],
  });
}

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function renderFilters(store = makeStore(), queryClient = makeQueryClient()) {
  return {
    store,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PromptFilters />
        </Provider>
      </QueryClientProvider>,
    ),
  };
}

describe("PromptFilters", () => {
  it("renders search input and status select", () => {
    renderFilters();
    expect(screen.getByPlaceholderText(/search prompts/i)).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /filter by status/i })).toBeTruthy();
  });

  it("does not show clear button when no filters are active", () => {
    renderFilters();
    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
  });

  it("updates Redux search state when typing in search input", async () => {
    const { store } = renderFilters();
    const input = screen.getByPlaceholderText(/search prompts/i);
    fireEvent.change(input, { target: { value: "customer" } });
    await waitFor(() => {
      expect(store.getState().ui.promptsFilter.search).toBe("customer");
    });
  });

  it("shows clear button when search has a value", async () => {
    const store = makeStore({
      ui: {
        sidebarOpen: false,
        activeModal: null,
        promptsFilter: { search: "test", status: "all", tagIds: [], sort: "updated_desc" as const },
        compareVersionIds: null,
      },
    });
    renderFilters(store);
    expect(screen.getByRole("button", { name: /clear/i })).toBeTruthy();
  });

  it("resets filter state when Clear button is clicked", async () => {
    const store = makeStore({
      ui: {
        sidebarOpen: false,
        activeModal: null,
        promptsFilter: { search: "old query", status: "active", tagIds: [], sort: "updated_desc" as const },
        compareVersionIds: null,
      },
    });
    renderFilters(store);
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    await waitFor(() => {
      const filter = store.getState().ui.promptsFilter;
      expect(filter.search).toBe("");
      expect(filter.status).toBe("all");
    });
  });

  it("shows clear button when status filter is active", () => {
    const store = makeStore({
      ui: {
        sidebarOpen: false,
        activeModal: null,
        promptsFilter: { search: "", status: "archived", tagIds: [], sort: "updated_desc" as const },
        compareVersionIds: null,
      },
    });
    renderFilters(store);
    expect(screen.getByRole("button", { name: /clear/i })).toBeTruthy();
  });
});

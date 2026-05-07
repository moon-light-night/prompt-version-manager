import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer, {
  setSidebarOpen,
  toggleSidebar,
  openModal,
  closeModal,
  setPromptsSearch,
  setPromptsStatus,
  setPromptsTagIds,
  resetPromptsFilter,
  setCompareVersionIds,
  clearCompareVersionIds,
  type UIState,
} from "@/store/slices/uiSlice";

function makeStore(preloadedState?: Partial<UIState>) {
  return configureStore({
    reducer: { ui: uiReducer },
    preloadedState: preloadedState ? { ui: preloadedState as UIState } : undefined,
  });
}

describe("uiSlice — sidebar", () => {
  it("starts with sidebar closed", () => {
    const store = makeStore();
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });

  it("setSidebarOpen(true) opens the sidebar", () => {
    const store = makeStore();
    store.dispatch(setSidebarOpen(true));
    expect(store.getState().ui.sidebarOpen).toBe(true);
  });

  it("toggleSidebar flips the state", () => {
    const store = makeStore();
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarOpen).toBe(true);
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });
});

describe("uiSlice — modal", () => {
  it("opens a modal by name", () => {
    const store = makeStore();
    store.dispatch(openModal("delete-prompt"));
    expect(store.getState().ui.activeModal).toBe("delete-prompt");
  });

  it("closes the active modal", () => {
    const store = makeStore();
    store.dispatch(openModal("some-modal"));
    store.dispatch(closeModal());
    expect(store.getState().ui.activeModal).toBeNull();
  });
});

describe("uiSlice — prompts filter", () => {
  it("sets search string", () => {
    const store = makeStore();
    store.dispatch(setPromptsSearch("hello"));
    expect(store.getState().ui.promptsFilter.search).toBe("hello");
  });

  it("sets status filter", () => {
    const store = makeStore();
    store.dispatch(setPromptsStatus("active"));
    expect(store.getState().ui.promptsFilter.status).toBe("active");
  });

  it("sets tag filter", () => {
    const store = makeStore();
    const tagIds = ["tag-1", "tag-2"];
    store.dispatch(setPromptsTagIds(tagIds));
    expect(store.getState().ui.promptsFilter.tagIds).toEqual(tagIds);
  });

  it("resetPromptsFilter clears all filter state", () => {
    const store = makeStore();
    store.dispatch(setPromptsSearch("hello"));
    store.dispatch(setPromptsStatus("archived"));
    store.dispatch(setPromptsTagIds(["tag-1"]));
    store.dispatch(resetPromptsFilter());
    const filter = store.getState().ui.promptsFilter;
    expect(filter.search).toBe("");
    expect(filter.status).toBe("all");
    expect(filter.tagIds).toEqual([]);
  });
});

describe("uiSlice — compare version ids", () => {
  it("starts with no compare ids", () => {
    const store = makeStore();
    expect(store.getState().ui.compareVersionIds).toBeNull();
  });

  it("sets two version ids for comparison", () => {
    const store = makeStore();
    const ids: [string, string] = ["v1", "v2"];
    store.dispatch(setCompareVersionIds(ids));
    expect(store.getState().ui.compareVersionIds).toEqual(["v1", "v2"]);
  });

  it("clearCompareVersionIds resets to null", () => {
    const store = makeStore();
    store.dispatch(setCompareVersionIds(["v1", "v2"]));
    store.dispatch(clearCompareVersionIds());
    expect(store.getState().ui.compareVersionIds).toBeNull();
  });
});

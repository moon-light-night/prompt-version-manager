import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PromptStatus, PromptSort } from "@pvm/shared";

export interface PromptsFilterState {
  search: string;
  status: PromptStatus | "all";
  tagIds: string[];
  sort: PromptSort;
}

export interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  promptsFilter: PromptsFilterState;
  compareVersionIds: [string, string] | null;
}

const initialState: UIState = {
  sidebarOpen: false,
  activeModal: null,
  promptsFilter: {
    search: "",
    status: "all",
    tagIds: [],
    sort: "updated_desc",
  },
  compareVersionIds: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    setPromptsSearch(state, action: PayloadAction<string>) {
      state.promptsFilter.search = action.payload;
    },
    setPromptsStatus(state, action: PayloadAction<PromptStatus | "all">) {
      state.promptsFilter.status = action.payload;
    },
    setPromptsTagIds(state, action: PayloadAction<string[]>) {
      state.promptsFilter.tagIds = action.payload;
    },
    setPromptsSort(state, action: PayloadAction<PromptSort>) {
      state.promptsFilter.sort = action.payload;
    },
    resetPromptsFilter(state) {
      state.promptsFilter = { search: "", status: "all", tagIds: [], sort: "updated_desc" };
    },
    setCompareVersionIds(state, action: PayloadAction<[string, string]>) {
      state.compareVersionIds = action.payload;
    },
    clearCompareVersionIds(state) {
      state.compareVersionIds = null;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  openModal,
  closeModal,
  setPromptsSearch,
  setPromptsStatus,
  setPromptsTagIds,
  setPromptsSort,
  resetPromptsFilter,
  setCompareVersionIds,
  clearCompareVersionIds,
} = uiSlice.actions;

export default uiSlice.reducer;

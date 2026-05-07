import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/store/slices/uiSlice";
import { AppSidebar } from "@/components/layout/AppSidebar";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

function makeStore(sidebarOpen = false) {
  return configureStore({
    reducer: { ui: uiReducer },
    preloadedState: {
      ui: {
        sidebarOpen,
        activeModal: null,
        promptsFilter: { search: "", status: "all" as const, tagIds: [], sort: "created_desc" as const },
        compareVersionIds: null,
      },
    },
  });
}

function renderSidebar(sidebarOpen = false) {
  const store = makeStore(sidebarOpen);
  const result = render(
    <Provider store={store}>
      <AppSidebar />
    </Provider>,
  );
  return { ...result, store };
}

describe("AppSidebar — navigation", () => {
  it("renders Dashboard nav link", () => {
    renderSidebar();
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("renders Prompts nav link", () => {
    renderSidebar();
    expect(screen.getByText("Prompts")).toBeTruthy();
  });

  it("renders Settings nav link", () => {
    renderSidebar();
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("renders About nav link", () => {
    renderSidebar();
    expect(screen.getByText("About")).toBeTruthy();
  });

  it("Dashboard link points to /dashboard", () => {
    renderSidebar();
    const link = screen.getByText("Dashboard").closest("a");
    expect(link?.getAttribute("href")).toBe("/dashboard");
  });

  it("Prompts link points to /prompts", () => {
    renderSidebar();
    const link = screen.getByText("Prompts").closest("a");
    expect(link?.getAttribute("href")).toBe("/prompts");
  });
});

describe("AppSidebar — mobile behavior", () => {
  it("close button dispatches setSidebarOpen(false)", () => {
    const { store } = renderSidebar(true);
    const closeButton = screen.getByLabelText("Close sidebar");
    fireEvent.click(closeButton);
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });

  it("clicking a nav link dispatches setSidebarOpen(false)", () => {
    const { store } = renderSidebar(true);
    const dashboardLink = screen.getByText("Dashboard");
    fireEvent.click(dashboardLink);
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });

  it("mobile overlay appears when sidebar is open", () => {
    const { container } = renderSidebar(true);
    const overlay = container.querySelector(".fixed.inset-0.z-30");
    expect(overlay).toBeTruthy();
  });

  it("mobile overlay closes sidebar when clicked", () => {
    const { store, container } = renderSidebar(true);
    const overlay = container.querySelector(".fixed.inset-0.z-30") as HTMLElement;
    fireEvent.click(overlay);
    expect(store.getState().ui.sidebarOpen).toBe(false);
  });
});

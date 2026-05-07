import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Folder, Layers } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState title="No items" description="Try creating one to get started." />,
    );
    expect(screen.getByText("Try creating one to get started.")).toBeTruthy();
  });

  it("renders action button when action provided", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="No prompts"
        action={{ label: "Create prompt", onClick: handleClick }}
      />,
    );
    const button = screen.getByRole("button", { name: "Create prompt" });
    expect(button).toBeTruthy();
  });

  it("calls action.onClick when action button clicked", () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        title="No prompts"
        action={{ label: "Create prompt", onClick: handleClick }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Create prompt" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not render button when no action provided", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("does not render description when not provided", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByText("Some description")).toBeNull();
  });

  it("accepts a custom icon", () => {
    render(<EmptyState title="No folders" icon={Folder} />);
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  it("uses default FileQuestion icon when no icon prop", () => {
    render(<EmptyState title="Default icon" />);
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  it("accepts custom className", () => {
    render(<EmptyState title="Styled" className="custom-class" />);
    const el = screen.getByTestId("empty-state");
    expect(el.className).toContain("custom-class");
  });

  it("works with Layers icon from lucide-react", () => {
    render(<EmptyState title="No prompts" icon={Layers} />);
    expect(screen.getByText("No prompts")).toBeTruthy();
  });
});

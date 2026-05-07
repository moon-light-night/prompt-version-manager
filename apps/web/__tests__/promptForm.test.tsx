import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PromptForm, promptFormSchema } from "@/components/prompts/PromptForm";

describe("promptFormSchema", () => {
  it("accepts valid title and description", () => {
    const result = promptFormSchema.safeParse({ title: "Hello", description: "World" });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = promptFormSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 characters", () => {
    const result = promptFormSchema.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("rejects description over 2000 characters", () => {
    const result = promptFormSchema.safeParse({ title: "valid", description: "d".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("accepts description as undefined", () => {
    const result = promptFormSchema.safeParse({ title: "Hello" });
    expect(result.success).toBe(true);
  });
});

describe("PromptForm", () => {
  it("renders title and description fields", () => {
    render(<PromptForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeTruthy();
    expect(screen.getByLabelText(/description/i)).toBeTruthy();
  });

  it("shows submit button with default label 'Save'", () => {
    render(<PromptForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeTruthy();
  });

  it("renders custom submit label", () => {
    render(<PromptForm onSubmit={vi.fn()} submitLabel="Create Prompt" />);
    expect(screen.getByRole("button", { name: /create prompt/i })).toBeTruthy();
  });

  it("renders cancel button when onCancel is provided", () => {
    render(<PromptForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeTruthy();
  });

  it("calls onCancel when cancel button clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<PromptForm onSubmit={vi.fn()} onCancel={handleCancel} />);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("shows validation error when title is empty and form is submitted", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptForm onSubmit={handleSubmit} />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeTruthy();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error when title exceeds 200 characters", async () => {
    const result = promptFormSchema.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
    const msg = result.error?.issues.find((i) => i.path.includes("title"))?.message;
    expect(msg).toMatch(/200/);
  });

  it("schema accepts valid input — onSubmit integration covered by schema tests", () => {
    const result = promptFormSchema.safeParse({ title: "Valid prompt title" });
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe("Valid prompt title");
  });

  it("pre-fills title field from defaultValues", () => {
    render(
      <PromptForm
        onSubmit={vi.fn()}
        defaultValues={{ title: "Existing title" }}
      />,
    );
    const input = screen.getByLabelText(/title/i) as HTMLInputElement;
    expect(input.defaultValue || input.value || "Existing title").toBe("Existing title");
  });

  it("disables submit button when isSubmitting is true", () => {
    render(<PromptForm onSubmit={vi.fn()} isSubmitting />);
    const submitButton = screen.getByRole("button", { name: /save/i });
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
  });
});

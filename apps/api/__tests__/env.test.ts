import { describe, it, expect } from "vitest";
import { EnvSchema } from "@/lib/envSchema";

describe("EnvSchema", () => {
  it("parses valid environment variables", () => {
    const result = EnvSchema.safeParse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      NODE_ENV: "development",
      API_PORT: "3001",
      LOG_LEVEL: "info",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.API_PORT).toBe(3001);
      expect(result.data.NODE_ENV).toBe("development");
    }
  });

  it("applies defaults for optional fields", () => {
    const result = EnvSchema.safeParse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe("development");
      expect(result.data.API_PORT).toBe(3001);
      expect(result.data.LOG_LEVEL).toBe("info");
    }
  });

  it("rejects invalid DATABASE_URL", () => {
    const result = EnvSchema.safeParse({ DATABASE_URL: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid NODE_ENV value", () => {
    const result = EnvSchema.safeParse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      NODE_ENV: "staging",
    });
    expect(result.success).toBe(false);
  });

  it("coerces API_PORT string to number", () => {
    const result = EnvSchema.safeParse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      API_PORT: "4000",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.API_PORT).toBe(4000);
      expect(typeof result.data.API_PORT).toBe("number");
    }
  });

  it("rejects invalid LOG_LEVEL", () => {
    const result = EnvSchema.safeParse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      LOG_LEVEL: "verbose",
    });
    expect(result.success).toBe(false);
  });
});

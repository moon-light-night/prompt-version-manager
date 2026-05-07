import pino from "pino";
import { EnvSchema } from "./envSchema";
import { LOG_EVENTS } from "@/constants/logger.constants";

export { EnvSchema } from "./envSchema";

const bootstrapLogger = pino({ level: "error" });

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  bootstrapLogger.error(
    {
      action: LOG_EVENTS.ENV_INVALID,
      fieldErrors: parsed.error.flatten().fieldErrors,
    },
    "Invalid environment variables",
  );
  process.exit(1);
}

export const env = parsed.data;

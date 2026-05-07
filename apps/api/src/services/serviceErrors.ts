import { TRPCError } from "@trpc/server";

export const notFoundByIdError = (entityName: string, entityId: string) =>
  new TRPCError({
    code: "NOT_FOUND",
    message: `${entityName} ${entityId} not found`,
  });

export const conflictError = (message: string) =>
  new TRPCError({
    code: "CONFLICT",
    message,
  });
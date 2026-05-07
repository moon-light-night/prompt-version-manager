import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import type { CreatePromptInput, UpdatePromptInput, ListPromptsInput } from "@/lib/trpc";
import { queryKeys } from "@/lib/queryKeys";
import type { PromptWithMeta, PaginatedResult } from "@pvm/shared";

export type { ListPromptsInput as ListPromptsParams, CreatePromptInput as CreatePromptParams, UpdatePromptInput as UpdatePromptParams };

export const usePrompts = (
  params: ListPromptsInput = {},
  options?: Omit<UseQueryOptions<PaginatedResult<PromptWithMeta>>, "queryKey" | "queryFn">,
) => {
  const normalised: ListPromptsInput = {
    status: params.status,
    search: params.search || undefined,
    tagIds: params.tagIds?.length ? params.tagIds : undefined,
    sort: params.sort ?? "updated_desc",
    limit: params.limit ?? 20,
    offset: params.offset ?? 0,
  };
  return useQuery({
    queryKey: queryKeys.prompts.list(normalised as Record<string, unknown>),
    queryFn: () => trpcClient.prompt.list.query(normalised),
    ...options,
  });
};

export const usePrompt = (
  id: string,
  options?: Omit<UseQueryOptions<PromptWithMeta>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.prompts.detail(id),
    queryFn: () => trpcClient.prompt.byId.query({ id }),
    enabled: !!id,
    ...options,
  });
};

export const useCreatePrompt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePromptInput) => trpcClient.prompt.create.mutate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.prompts.all });
    },
  });
};

export const useUpdatePrompt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePromptInput) => trpcClient.prompt.update.mutate(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.prompts.all });
      qc.invalidateQueries({ queryKey: queryKeys.prompts.detail(variables.id) });
    },
  });
};

export const useArchivePrompt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trpcClient.prompt.archive.mutate({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.prompts.all });
    },
  });
};

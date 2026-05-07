import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import type { CreateVersionInput } from "@/lib/trpc";
import { queryKeys } from "@/lib/queryKeys";
import type { PromptVersion, VersionCompareResult } from "@pvm/shared";

export const useVersions = (promptId: string) => {
  return useQuery<PromptVersion[]>({
    queryKey: queryKeys.versions.list(promptId),
    queryFn: () => trpcClient.promptVersion.listByPrompt.query({ promptId }),
    enabled: !!promptId,
  });
};

export const useVersion = (id: string | null | undefined) => {
  return useQuery<PromptVersion>({
    queryKey: queryKeys.versions.detail(id ?? ""),
    queryFn: () => trpcClient.promptVersion.byId.query({ id: id! }),
    enabled: !!id,
  });
};

export const useCompareVersions = (
  versionAId: string | null,
  versionBId: string | null,
) => {
  return useQuery<VersionCompareResult>({
    queryKey: queryKeys.versions.compare(versionAId ?? "", versionBId ?? ""),
    queryFn: () =>
      trpcClient.promptVersion.compare.query({
        versionAId: versionAId!,
        versionBId: versionBId!,
      }),
    enabled: !!versionAId && !!versionBId,
  });
};

export const useCreateVersion = (promptId: string) => {
  const queryClient = useQueryClient();

  return useMutation<PromptVersion, Error, CreateVersionInput>({
    mutationFn: (data) => trpcClient.promptVersion.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.versions.list(promptId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.detail(promptId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
    },
  });
};

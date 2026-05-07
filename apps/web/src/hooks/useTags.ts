import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import { queryKeys } from "@/lib/queryKeys";
import type { Tag } from "@pvm/shared";

export const useTags = () => {
  return useQuery<Tag[]>({
    queryKey: queryKeys.tags.list(),
    queryFn: () => trpcClient.tag.list.query(),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePromptTags = (promptId: string) => {
  return useQuery<Tag[]>({
    queryKey: queryKeys.tags.byPrompt(promptId),
    queryFn: () => trpcClient.tag.getByPrompt.query({ promptId }),
    enabled: !!promptId,
  });
};

export const useAttachTag = (promptId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId }: { tagId: string }) =>
      trpcClient.tag.attach.mutate({ promptId, tagId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tags.byPrompt(promptId) });
      qc.invalidateQueries({ queryKey: queryKeys.prompts.detail(promptId) });
    },
  });
};

export const useDetachTag = (promptId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId }: { tagId: string }) =>
      trpcClient.tag.detach.mutate({ promptId, tagId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tags.byPrompt(promptId) });
      qc.invalidateQueries({ queryKey: queryKeys.prompts.detail(promptId) });
    },
  });
};

export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation<Tag, Error, { name: string; color?: string | null }>({
    mutationFn: ({ name, color }) => trpcClient.tag.create.mutate({ name, color }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

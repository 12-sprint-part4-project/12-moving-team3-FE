import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '@/hooks/reviewQueryKeys';
import { moverQueryKeys } from '@/hooks/useMoversList';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';

export interface UseReviewMutationOptions<TVariables> {
  mutationFn: (variables: TVariables) => Promise<unknown>;
  successMessage: string;
  errorFallbackMessage: string;
}

/**
 * 리뷰 create/delete 공통 mutation.
 * 성공 토스트 + 리뷰·기사 목록/상세 invalidate + 에러 토스트 + 연타 가드.
 */
export const useReviewMutation = <TVariables>({
  mutationFn,
  successMessage,
  errorFallbackMessage,
}: UseReviewMutationOptions<TVariables>) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn,
    onSuccess: async () => {
      showToast({ content: successMessage });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: moverQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: moverQueryKeys.details() }),
      ]);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : errorFallbackMessage;
      showToast({ content: message });
    },
  });

  const submit = async (variables: TVariables): Promise<void> => {
    if (mutation.isPending) {
      return;
    }
    await mutation.mutateAsync(variables);
  };

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    submit,
  };
};

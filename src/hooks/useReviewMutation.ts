import { useMutation, useQueryClient } from '@tanstack/react-query';

import { moverQueryKeys, reviewQueryKeys } from '@/constants/queryKey';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';

export interface UseReviewMutationOptions<TVariables, TResult> {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  successMessage: string;
  errorFallbackMessage: string;
}

/**
 * 리뷰 create/delete 공통 mutation.
 * 성공 토스트 + 리뷰·기사 목록/상세 invalidate + 에러 토스트 + 연타 가드.
 */
export const useReviewMutation = <TVariables, TResult = boolean>({
  mutationFn,
  successMessage,
  errorFallbackMessage,
}: UseReviewMutationOptions<TVariables, TResult>) => {
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

  const submit = async (
    variables: TVariables
  ): Promise<TResult | false> => {
    if (mutation.isPending) {
      return false;
    }
    return mutation.mutateAsync(variables);
  };

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    submit,
  };
};

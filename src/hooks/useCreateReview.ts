import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '@/hooks/reviewQueryKeys';
import { moverQueryKeys } from '@/hooks/useMoversList';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { createReview } from '@/services/reviewsApi';
import type { ReviewBody } from '@/types/review';

export interface CreateReviewVariables {
  quoteId: number;
  body: ReviewBody;
}

/**
 * 리뷰 등록.
 * 성공 시 토스트 + 리뷰·기사 목록/상세 쿼리 invalidate.
 * pending 중 추가 호출은 무시한다 (연타 방지).
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ quoteId, body }: CreateReviewVariables) =>
      createReview(quoteId, body),
    onSuccess: async () => {
      showToast({ content: '리뷰가 등록되었습니다.' });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: moverQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: moverQueryKeys.details() }),
      ]);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError
          ? error.message
          : '리뷰 등록 중 오류가 발생했습니다.';
      showToast({ content: message });
    },
  });

  const submitReview = async (
    quoteId: number,
    body: ReviewBody
  ): Promise<void> => {
    if (mutation.isPending) {
      return;
    }
    await mutation.mutateAsync({ quoteId, body });
  };

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    submitReview,
  };
};

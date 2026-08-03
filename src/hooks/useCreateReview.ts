import { useMutation, useQueryClient } from '@tanstack/react-query';

import { moverQueryKeys } from '@/hooks/useMoversList';
import { reviewQueryKeys } from '@/hooks/useMoverReviews';
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
 * 성공 시 리뷰·기사 목록/상세 쿼리를 invalidate 한다.
 * pending 중 추가 mutate는 무시한다 (연타 방지).
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ quoteId, body }: CreateReviewVariables) =>
      createReview(quoteId, body),
    onSuccess: async () => {
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

  const submitReview = (quoteId: number, body: ReviewBody): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate({ quoteId, body });
  };

  return {
    ...mutation,
    isPending: mutation.isPending,
    submitReview,
  };
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { moverQueryKeys } from '@/hooks/useMoversList';
import { reviewQueryKeys } from '@/hooks/useMoverReviews';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { updateReview } from '@/services/reviewsApi';
import type { ReviewBody } from '@/types/review';

export interface UpdateReviewVariables {
  reviewId: number;
  body: ReviewBody;
}

/**
 * 리뷰 수정.
 * 성공 시 리뷰·기사 목록/상세 쿼리를 invalidate 한다.
 * pending 중 추가 mutate는 무시한다 (연타 방지).
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ reviewId, body }: UpdateReviewVariables) =>
      updateReview(reviewId, body),
    onSuccess: async () => {
      showToast({ content: '리뷰가 수정되었습니다' });
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
          : '리뷰 수정 중 오류가 발생했습니다.';
      showToast({ content: message });
    },
  });

  const submitUpdate = (reviewId: number, body: ReviewBody): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate({ reviewId, body });
  };

  return {
    ...mutation,
    isPending: mutation.isPending,
    submitUpdate,
  };
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { moverQueryKeys } from '@/hooks/useMoversList';
import { reviewQueryKeys } from '@/hooks/useMoverReviews';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { deleteReview } from '@/services/reviewsApi';

/**
 * 리뷰 삭제(소프트 딜리트).
 * 성공 시 리뷰·기사 목록/상세 쿼리를 invalidate 한다.
 * pending 중 추가 mutate는 무시한다 (연타 방지).
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: async () => {
      showToast({ content: '리뷰가 삭제되었습니다.' });
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
          : '리뷰 삭제 중 오류가 발생했습니다.';
      showToast({ content: message });
    },
  });

  const submitDelete = (reviewId: number): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate(reviewId);
  };

  return {
    ...mutation,
    isPending: mutation.isPending,
    submitDelete,
  };
};

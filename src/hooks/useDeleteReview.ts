import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewQueryKeys } from '@/hooks/reviewQueryKeys';
import { moverQueryKeys } from '@/hooks/useMoversList';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { deleteReview } from '@/services/reviewsApi';

/**
 * 리뷰 삭제(소프트 딜리트).
 * 성공 시 토스트 + 리뷰·기사 목록/상세 쿼리 invalidate.
 * pending 중 추가 호출은 무시한다 (연타 방지).
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

  const submitDelete = async (reviewId: number): Promise<void> => {
    if (mutation.isPending) {
      return;
    }
    await mutation.mutateAsync(reviewId);
  };

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    submitDelete,
  };
};

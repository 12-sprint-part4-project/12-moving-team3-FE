import { useReviewMutation } from '@/hooks/useReviewMutation';
import { deleteReview } from '@/services/reviewsApi';

/**
 * 리뷰 삭제(소프트 딜리트).
 * 성공 시 토스트 + 리뷰·기사 목록/상세 쿼리 invalidate.
 * pending 중 추가 호출은 무시한다 (연타 방지).
 */
export const useDeleteReview = () => {
  const { submit, isPending, isError, error } = useReviewMutation<number>({
    mutationFn: (reviewId) => deleteReview(reviewId),
    successMessage: '리뷰가 삭제되었습니다.',
    errorFallbackMessage: '리뷰 삭제 중 오류가 발생했습니다.',
  });

  const submitDelete = async (reviewId: number): Promise<void> => {
    await submit(reviewId);
  };

  return {
    isPending,
    isError,
    error,
    submitDelete,
  };
};

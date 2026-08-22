import { useReviewMutation } from '@/hooks/useReviewMutation';
import { useTranslation } from '@/i18n/useTranslation';
import { deleteReview } from '@/services/reviewsApi';

/**
 * 리뷰 삭제(소프트 딜리트).
 * 성공 시 토스트 + 리뷰·기사 목록/상세 쿼리 invalidate.
 * pending 중 추가 호출은 무시하고 false를 반환한다 (연타 방지).
 */
export const useDeleteReview = () => {
  const { t } = useTranslation();
  const { submit, isPending, isError, error } = useReviewMutation<
    number,
    boolean
  >({
    mutationFn: async (reviewId) => {
      await deleteReview(reviewId);
      return true;
    },
    successMessage: t('reviews.toast.deleted'),
    errorFallbackMessage: t('reviews.toast.deleteError'),
  });

  const submitDelete = async (reviewId: number): Promise<boolean> =>
    submit(reviewId);

  return {
    isPending,
    isError,
    error,
    submitDelete,
  };
};

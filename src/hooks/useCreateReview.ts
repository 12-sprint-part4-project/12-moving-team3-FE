import { useReviewMutation } from '@/hooks/useReviewMutation';
import { createReview } from '@/services/reviewsApi';

import type { CreateReviewResponse, ReviewBody } from '@/types/review';

export interface CreateReviewVariables {
  quoteId: number;
  body: ReviewBody;
}

/**
 * 리뷰 등록.
 * 성공 시 토스트 + 리뷰·기사 목록/상세 쿼리 invalidate.
 * pending 중 추가 호출은 무시하고 false를 반환한다 (연타 방지).
 */
export const useCreateReview = () => {
  const { submit, isPending, isError, error } = useReviewMutation<
    CreateReviewVariables,
    CreateReviewResponse
  >({
    mutationFn: ({ quoteId, body }) => createReview(quoteId, body),
    successMessage: '리뷰가 등록되었습니다.',
    errorFallbackMessage: '리뷰 등록 중 오류가 발생했습니다.',
  });

  const submitReview = async (
    quoteId: number,
    body: ReviewBody
  ): Promise<number | false> => {
    const result = await submit({ quoteId, body });
    if (result === false) {
      return false;
    }
    return result.data.id;
  };

  return {
    isPending,
    isError,
    error,
    submitReview,
  };
};

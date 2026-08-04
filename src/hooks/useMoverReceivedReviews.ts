import { reviewQueryKeys } from '@/hooks/reviewQueryKeys';
import { useReviewPagedQuery } from '@/hooks/useReviewPagedQuery';
import { getMoverReceivedReviews } from '@/services/reviewsApi';
import type {
  MoverReceivedReviewItem,
  MoverReceivedReviewsResponse,
} from '@/types/review';

/**
 * 로그인한 기사님에게 달린 리뷰 목록 (페이지네이션).
 * GET /api/review/mover
 * 로그인(MOVER)일 때만 요청한다.
 */
export const useMoverReceivedReviews = (options?: {
  enabled?: boolean;
  limit?: number;
}) => {
  const { items, data, ...rest } = useReviewPagedQuery<
    MoverReceivedReviewsResponse,
    MoverReceivedReviewItem
  >({
    enabled: options?.enabled,
    limit: options?.limit,
    queryKey: reviewQueryKeys.moverReceivedList,
    queryFn: getMoverReceivedReviews,
    selectItems: (response) => response.data.reviews,
  });

  return {
    ...rest,
    data,
    reviews: items,
    ratingStatistics: data?.meta.ratingStatistics,
  };
};

import { reviewQueryKeys } from '@/hooks/reviewQueryKeys';
import { useReviewPagedQuery } from '@/hooks/useReviewPagedQuery';
import { getCustomerReviews } from '@/services/reviewsApi';
import type { CustomerReviewItem, CustomerReviewsResponse } from '@/types/review';

/**
 * 고객이 작성한 리뷰 목록 (페이지네이션).
 * GET /api/review/customer
 * 로그인(CUSTOMER)일 때만 요청한다.
 */
export const useCustomerReviews = (options?: {
  enabled?: boolean;
  limit?: number;
}) => {
  const { items, ...rest } = useReviewPagedQuery<
    CustomerReviewsResponse,
    CustomerReviewItem
  >({
    enabled: options?.enabled,
    limit: options?.limit,
    queryKey: reviewQueryKeys.customerList,
    queryFn: getCustomerReviews,
    selectItems: (data) => data.data.reviews,
  });

  return {
    ...rest,
    reviews: items,
  };
};

import { reviewQueryKeys } from '@/constants/queryKey';
import { useReviewPagedQuery } from '@/hooks/useReviewPagedQuery';
import { getCustomerWritableQuotes } from '@/services/reviewsApi';

import type { WritableQuoteItem, WritableQuotesResponse } from '@/types/review';

/**
 * 리뷰 작성 가능한 견적 목록 (페이지네이션).
 * GET /api/review/customer/writable
 * 로그인(CUSTOMER)일 때만 요청한다.
 */
export const useCustomerWritableQuotes = (options?: {
  enabled?: boolean;
  limit?: number;
}) => {
  const { items, ...rest } = useReviewPagedQuery<
    WritableQuotesResponse,
    WritableQuoteItem
  >({
    enabled: options?.enabled,
    limit: options?.limit,
    queryKey: reviewQueryKeys.writableList,
    queryFn: getCustomerWritableQuotes,
    selectItems: (data) => data.data.writableQuotes,
  });

  return {
    ...rest,
    writableQuotes: items,
  };
};

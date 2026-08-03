import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  MOVER_REVIEWS_PAGE_SIZE,
  reviewQueryKeys,
} from '@/hooks/reviewQueryKeys';
import { getMoverAccessToken } from '@/services/moversAuth';
import { getCustomerReviews } from '@/services/reviewsApi';

/**
 * 고객이 작성한 리뷰 목록 (페이지네이션).
 * GET /api/review/customer
 * 로그인(CUSTOMER)일 때만 요청한다.
 */
export const useCustomerReviews = (options?: {
  enabled?: boolean;
  limit?: number;
}) => {
  const enabled = options?.enabled ?? true;
  const limit = options?.limit ?? MOVER_REVIEWS_PAGE_SIZE;
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: reviewQueryKeys.customerList(page, limit),
    queryFn: () => getCustomerReviews({ page, limit }),
    enabled: enabled && Boolean(getMoverAccessToken()),
    placeholderData: keepPreviousData,
  });

  const pagination = query.data?.meta.pagination;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize))
    : 1;

  return {
    ...query,
    reviews: query.data?.data.reviews ?? [],
    pagination,
    page,
    totalPages,
    setPage,
    isEmpty:
      !query.isPending &&
      !query.isError &&
      (query.data?.data.reviews.length ?? 0) === 0,
  };
};

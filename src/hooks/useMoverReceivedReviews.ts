import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  MOVER_REVIEWS_PAGE_SIZE,
  reviewQueryKeys,
} from '@/hooks/useMoverReviews';
import { getMoverAccessToken } from '@/services/moversAuth';
import { getMoverReceivedReviews } from '@/services/reviewsApi';

/**
 * 로그인한 기사님에게 달린 리뷰 목록 (페이지네이션).
 * GET /api/review/mover
 * 로그인(MOVER)일 때만 요청한다. UI 연동 전에도 캐시 키를 고정해 둔다.
 */
export const useMoverReceivedReviews = (options?: {
  enabled?: boolean;
  limit?: number;
}) => {
  const enabled = options?.enabled ?? true;
  const limit = options?.limit ?? MOVER_REVIEWS_PAGE_SIZE;
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: reviewQueryKeys.moverReceivedList(page, limit),
    queryFn: () => getMoverReceivedReviews({ page, limit }),
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
    ratingStatistics: query.data?.meta.ratingStatistics,
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

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  MOVER_REVIEWS_PAGE_SIZE,
  reviewQueryKeys,
} from '@/hooks/reviewQueryKeys';
import { getMoverPublicReviews } from '@/services/reviewsApi';
import { isMoverId } from '@/types/mover';

/**
 * 기사님 공개 리뷰 목록 (페이지네이션).
 * GET /api/movers/:id/reviews
 */
export const useMoverReviews = (
  moverId: string,
  options?: { limit?: number }
) => {
  const limit = options?.limit ?? MOVER_REVIEWS_PAGE_SIZE;
  const [page, setPage] = useState(1);
  const enabled = isMoverId(moverId);

  const query = useQuery({
    queryKey: reviewQueryKeys.publicList(moverId, page, limit),
    queryFn: () => getMoverPublicReviews(moverId, { page, limit }),
    enabled,
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
  };
};

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getMoverPublicReviews } from '@/services/reviewsApi';
import { isMoverId } from '@/types/mover';

/** BE 기본·최대 pageSize와 동일 */
export const MOVER_REVIEWS_PAGE_SIZE = 6;

/** 리뷰 도메인 공통 queryKey (등록 후 invalidate용) */
export const reviewQueryKeys = {
  all: ['reviews'] as const,
  publicByMover: (moverId: string) =>
    [...reviewQueryKeys.all, 'public', moverId] as const,
  publicList: (moverId: string, page: number, limit: number) =>
    [...reviewQueryKeys.publicByMover(moverId), { page, limit }] as const,
  writable: () => [...reviewQueryKeys.all, 'writable'] as const,
  writableList: (page: number, limit: number) =>
    [...reviewQueryKeys.writable(), { page, limit }] as const,
  customer: () => [...reviewQueryKeys.all, 'customer'] as const,
  customerList: (page: number, limit: number) =>
    [...reviewQueryKeys.customer(), { page, limit }] as const,
};

/**
 * 기사님 공개 리뷰 목록 (페이지네이션).
 * GET /api/movers/:id/reviews
 * UI 연동 전에도 호출·캐시 키를 고정해 둔다.
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

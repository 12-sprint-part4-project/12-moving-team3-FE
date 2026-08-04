'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import {
  getMoverReviews,
  toMoverReviewsViewModel,
} from '@/services/reviewApi';
import type { MoverReviewsViewModel } from '@/types/review';

/** 마이페이지 리뷰 목록 기본 페이지 크기 (Figma 카드 5개) */
const DEFAULT_REVIEWS_LIMIT = 5;

export const moverReviewQueryKeys = {
  all: ['mover-reviews'] as const,
  lists: () => [...moverReviewQueryKeys.all, 'list'] as const,
  list: (userId: string, page: number, limit: number) =>
    [...moverReviewQueryKeys.lists(), userId, { page, limit }] as const,
};

export interface UseMoverReviewsParams {
  page: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * 기사님 본인 리뷰 목록 + 평점 통계 조회.
 * GET /api/review/mover
 */
export const useMoverReviews = ({
  page,
  limit = DEFAULT_REVIEWS_LIMIT,
  enabled = true,
}: UseMoverReviewsParams) => {
  const { user } = useAuth();
  const userId = user?.id;

  const query = useQuery({
    queryKey: moverReviewQueryKeys.list(userId ?? 'anonymous', page, limit),
    queryFn: async (): Promise<MoverReviewsViewModel> => {
      const response = await getMoverReviews({ page, limit });
      return toMoverReviewsViewModel(response);
    },
    enabled: enabled && Boolean(userId),
    placeholderData: (previousData) => previousData,
  });

  const reviews = query.data?.reviews ?? [];
  const reviewStats = query.data?.reviewStats;
  const totalPages = query.data?.totalPages ?? 0;
  const currentPage = query.data?.currentPage ?? page;

  return {
    ...query,
    reviews,
    reviewStats,
    totalCount: query.data?.totalCount ?? 0,
    totalPages,
    currentPage,
    isEmpty: !query.isPending && !query.isError && reviews.length === 0,
  };
};

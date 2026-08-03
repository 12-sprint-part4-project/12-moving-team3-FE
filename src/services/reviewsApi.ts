import { API_BASE_URL } from '@/lib/apiClient';
import { fetchAndValidate } from '@/services/moverApiResponse';
import type {
  MoverPublicReviewsParams,
  MoverPublicReviewsResponse,
} from '@/types/review';

const isMoverPublicReviewsResponse = (
  body: unknown
): body is MoverPublicReviewsResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data, meta } = body as {
    data?: unknown;
    meta?: unknown;
  };

  if (!data || typeof data !== 'object') {
    return false;
  }

  if (!Array.isArray((data as { reviews?: unknown }).reviews)) {
    return false;
  }

  if (!meta || typeof meta !== 'object') {
    return false;
  }

  const reviewsMeta = meta as {
    pagination?: unknown;
    ratingStatistics?: unknown;
  };

  if (
    !reviewsMeta.pagination ||
    typeof reviewsMeta.pagination !== 'object' ||
    !reviewsMeta.ratingStatistics ||
    typeof reviewsMeta.ratingStatistics !== 'object'
  ) {
    return false;
  }

  const pagination = reviewsMeta.pagination as {
    currentPage?: unknown;
    pageSize?: unknown;
    totalCount?: unknown;
    hasNextPage?: unknown;
  };

  return (
    typeof pagination.currentPage === 'number' &&
    typeof pagination.pageSize === 'number' &&
    typeof pagination.totalCount === 'number' &&
    typeof pagination.hasNextPage === 'boolean'
  );
};

/**
 * 기사님 공개 리뷰 목록 조회.
 * GET /api/movers/:id/reviews (회원/비회원)
 */
export const getMoverPublicReviews = async (
  moverId: string,
  params: MoverPublicReviewsParams = {}
): Promise<MoverPublicReviewsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  return fetchAndValidate(
    `${API_BASE_URL}/api/movers/${moverId}/reviews${suffix}`,
    { method: 'GET' },
    isMoverPublicReviewsResponse,
    '리뷰를 불러오지 못했습니다.'
  );
};

import { API_BASE_URL } from '@/lib/apiClient';
import { fetchAndValidate, fetchNoContent } from '@/services/moverApiResponse';
import { assertMoverAccessToken } from '@/services/moversAuth';

import type {
  CreateReviewResponse,
  CustomerReviewsParams,
  CustomerReviewsResponse,
  MoverPublicReviewsParams,
  MoverPublicReviewsResponse,
  MoverReceivedReviewsParams,
  MoverReceivedReviewsResponse,
  ReviewBody,
  UpdateReviewResponse,
  WritableQuotesParams,
  WritableQuotesResponse,
} from '@/types/review';

const isReviewDetailResponse = (
  body: unknown
): body is CreateReviewResponse | UpdateReviewResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = (body as { data?: unknown }).data;
  if (!data || typeof data !== 'object') {
    return false;
  }

  const review = data as {
    id?: unknown;
    quoteId?: unknown;
    rating?: unknown;
    content?: unknown;
    createdAt?: unknown;
  };

  return (
    typeof review.id === 'number' &&
    typeof review.quoteId === 'number' &&
    typeof review.rating === 'number' &&
    typeof review.content === 'string' &&
    typeof review.createdAt === 'string'
  );
};

/**
 * 리뷰 등록 (CUSTOMER).
 * POST /api/review/quotes/:quoteId
 */
export const createReview = async (
  quoteId: number,
  body: ReviewBody
): Promise<CreateReviewResponse> => {
  assertMoverAccessToken();

  return fetchAndValidate(
    `${API_BASE_URL}/api/review/quotes/${quoteId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    isReviewDetailResponse,
    '리뷰 등록에 실패했습니다.'
  );
};

/**
 * 리뷰 수정 (CUSTOMER).
 * PATCH /api/review/:reviewId
 */
export const updateReview = async (
  reviewId: number,
  body: ReviewBody
): Promise<UpdateReviewResponse> => {
  assertMoverAccessToken();

  return fetchAndValidate(
    `${API_BASE_URL}/api/review/${reviewId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    isReviewDetailResponse,
    '리뷰 수정에 실패했습니다.'
  );
};

/**
 * 리뷰 삭제(소프트 딜리트) (CUSTOMER).
 * DELETE /api/review/:reviewId → 204
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  assertMoverAccessToken();

  return fetchNoContent(
    `${API_BASE_URL}/api/review/${reviewId}`,
    { method: 'DELETE' },
    '리뷰 삭제에 실패했습니다.'
  );
};

const isPaginationMeta = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const pagination = value as {
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

const isWritableQuotesResponse = (
  body: unknown
): body is WritableQuotesResponse => {
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

  if (!Array.isArray((data as { writableQuotes?: unknown }).writableQuotes)) {
    return false;
  }

  if (!meta || typeof meta !== 'object') {
    return false;
  }

  return isPaginationMeta((meta as { pagination?: unknown }).pagination);
};

/**
 * 리뷰 작성 가능한 견적 목록 조회 (CUSTOMER).
 * GET /api/review/customer/writable
 */
export const getCustomerWritableQuotes = async (
  params: WritableQuotesParams = {}
): Promise<WritableQuotesResponse> => {
  assertMoverAccessToken();

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
    `${API_BASE_URL}/api/review/customer/writable${suffix}`,
    { method: 'GET' },
    isWritableQuotesResponse,
    '작성 가능한 견적 목록을 불러오지 못했습니다.'
  );
};

const isCustomerReviewsResponse = (
  body: unknown
): body is CustomerReviewsResponse => {
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

  return isPaginationMeta((meta as { pagination?: unknown }).pagination);
};

/**
 * 고객이 작성한 리뷰 목록 조회 (CUSTOMER).
 * GET /api/review/customer
 */
export const getCustomerReviews = async (
  params: CustomerReviewsParams = {}
): Promise<CustomerReviewsResponse> => {
  assertMoverAccessToken();

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
    `${API_BASE_URL}/api/review/customer${suffix}`,
    { method: 'GET' },
    isCustomerReviewsResponse,
    '작성한 리뷰 목록을 불러오지 못했습니다.'
  );
};

const isMoverReviewsWithStatsResponse = (
  body: unknown
): body is MoverPublicReviewsResponse | MoverReceivedReviewsResponse => {
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

  return (
    isPaginationMeta(reviewsMeta.pagination) &&
    Boolean(reviewsMeta.ratingStatistics) &&
    typeof reviewsMeta.ratingStatistics === 'object'
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
    isMoverReviewsWithStatsResponse,
    '리뷰를 불러오지 못했습니다.'
  );
};

/**
 * 로그인한 기사님에게 달린 리뷰 목록 조회 (MOVER).
 * GET /api/review/mover
 */
export const getMoverReceivedReviews = async (
  params: MoverReceivedReviewsParams = {}
): Promise<MoverReceivedReviewsResponse> => {
  assertMoverAccessToken();

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
    `${API_BASE_URL}/api/review/mover${suffix}`,
    { method: 'GET' },
    isMoverReviewsWithStatsResponse,
    '받은 리뷰 목록을 불러오지 못했습니다.'
  );
};

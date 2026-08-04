import {
  API_BASE_URL,
  createApiTimeoutSignal,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type { ReviewStats } from '@/types/mover';
import type {
  MoverReviewsParams,
  MoverReviewsResponse,
  MoverReviewsViewModel,
  MoverReviewItem,
  ReviewRatingStatistics,
} from '@/types/review';

const MOVER_REVIEWS_PATH = '/api/review/mover';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

/** 리뷰 작성자 이름 마스킹 — 앞 글자 + **** */
export const maskReviewerName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '****';
  }
  return `${trimmed.slice(0, 1)}****`;
};

/** ISO datetime → YYYY-MM-DD (로컬 캘린더) */
export const formatReviewDateLabel = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** ratingStatistics + totalCount → ReviewStats */
export const toReviewStats = (
  statistics: ReviewRatingStatistics,
  totalCount: number
): ReviewStats => {
  const averageRating =
    totalCount <= 0 ? null : Number(statistics.average.toFixed(1));

  return {
    averageRating,
    totalCount,
    ratingCounts: {
      1: statistics.one,
      2: statistics.two,
      3: statistics.three,
      4: statistics.four,
      5: statistics.five,
    },
  };
};

/** API 리뷰 아이템 → 목록 카드 모델 */
export const toMoverReviewListItem = (item: MoverReviewItem) => ({
  id: String(item.id),
  reviewerName: maskReviewerName(item.customer.name),
  createdAt: formatReviewDateLabel(item.createdAt),
  rating: item.rating,
  content: item.content,
});

/** 응답 → 마이페이지 리뷰 뷰 모델 */
export const toMoverReviewsViewModel = (
  response: MoverReviewsResponse
): MoverReviewsViewModel => {
  const { pagination, ratingStatistics } = response.meta;
  const totalCount = pagination.totalCount;
  const pageSize = pagination.pageSize;
  const totalPages =
    pageSize > 0 && totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

  return {
    reviews: response.data.reviews.map(toMoverReviewListItem),
    reviewStats: toReviewStats(ratingStatistics, totalCount),
    totalCount,
    totalPages,
    currentPage: pagination.currentPage,
    pageSize,
  };
};

/** GET /api/review/mover */
export const getMoverReviews = async (
  params: MoverReviewsParams = {}
): Promise<MoverReviewsResponse> => {
  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await authFetch(
    `${API_BASE_URL}${MOVER_REVIEWS_PATH}?${query.toString()}`,
    {
      method: 'GET',
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return throwApiError(response);
  }

  return (await response.json()) as MoverReviewsResponse;
};

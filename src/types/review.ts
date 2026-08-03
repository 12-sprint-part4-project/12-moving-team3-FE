import type { ApiSuccessResponse } from '@/types/api';

/** 목록·상세·찜 등에서 쓰는 별점 분포 카운트 */
export interface ReviewRatingCounts {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

/** 기사 리뷰 집계 (목록 item.review / 상세 reviewStats) */
export interface ReviewStats {
  ratingCounts: ReviewRatingCounts;
  totalCount: number;
  averageRating: number | null;
}

/** GET /api/movers/:id/reviews 쿼리 */
export interface MoverPublicReviewsParams {
  page?: number;
  limit?: number;
}

/** GET /api/movers/:id/reviews → data.reviews[] */
export interface MoverPublicReviewItem {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  };
}

export interface ReviewPaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

/** BE meta.ratingStatistics (별점 분포) */
export interface ReviewRatingStatistics {
  average: number;
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface MoverPublicReviewsMeta {
  pagination: ReviewPaginationMeta;
  ratingStatistics: ReviewRatingStatistics;
}

export type MoverPublicReviewsResponse = ApiSuccessResponse<
  { reviews: MoverPublicReviewItem[] },
  MoverPublicReviewsMeta
> & {
  meta: MoverPublicReviewsMeta;
};

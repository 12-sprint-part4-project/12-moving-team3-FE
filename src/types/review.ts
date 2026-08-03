import type { ApiSuccessResponse } from '@/types/api';

/** BE reviewBodySchema와 동일 */
export const MIN_REVIEW_CONTENT_LENGTH = 10;
export const MAX_REVIEW_CONTENT_LENGTH = 600;

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

/** 리뷰 등록·수정 Body */
export interface ReviewBody {
  rating: number;
  content: string;
}

/** POST / PATCH 성공 시 data */
export interface ReviewDetail {
  id: number;
  quoteId: number;
  rating: number;
  content: string;
  createdAt: string;
}

export type CreateReviewResponse = ApiSuccessResponse<ReviewDetail>;

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

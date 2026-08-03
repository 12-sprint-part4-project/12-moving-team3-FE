import type { ApiSuccessResponse } from '@/types/api';
import type { ApiMoveType } from '@/types/estimateRequest';

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

/** GET /api/review/customer/writable 쿼리 */
export interface WritableQuotesParams {
  page?: number;
  limit?: number;
}

export interface WritableQuoteMover {
  id: string;
  name: string;
  profileImageUrl: string | null;
}

/** GET /api/review/customer/writable → data.writableQuotes[] */
export interface WritableQuoteItem {
  quoteId: number;
  moveType: ApiMoveType | null;
  isDesignated: boolean;
  /** YYYY-MM-DD */
  moveDate: string | null;
  price: number | null;
  mover: WritableQuoteMover | null;
}

export interface WritableQuotesMeta {
  pagination: ReviewPaginationMeta;
}

export type WritableQuotesResponse = ApiSuccessResponse<
  { writableQuotes: WritableQuoteItem[] },
  WritableQuotesMeta
> & {
  meta: WritableQuotesMeta;
};

/** GET /api/review/customer 쿼리 */
export interface CustomerReviewsParams {
  page?: number;
  limit?: number;
}

/** GET /api/review/customer → data.reviews[].quote */
export interface CustomerReviewQuote {
  id: number;
  moveType: ApiMoveType | null;
  /** YYYY-MM-DD */
  moveDate: string | null;
  price: number | null;
  isDesignated: boolean;
}

/** GET /api/review/customer → data.reviews[] */
export interface CustomerReviewItem {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  mover: WritableQuoteMover | null;
  quote: CustomerReviewQuote | null;
}

export interface CustomerReviewsMeta {
  pagination: ReviewPaginationMeta;
}

export type CustomerReviewsResponse = ApiSuccessResponse<
  { reviews: CustomerReviewItem[] },
  CustomerReviewsMeta
> & {
  meta: CustomerReviewsMeta;
};

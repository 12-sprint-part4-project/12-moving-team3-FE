import type { ApiSuccessResponse } from '@/types/api';
import type { ReviewStats } from '@/types/mover';

/** GET /api/review/mover 쿼리 */
export interface MoverReviewsParams {
  page?: number;
  limit?: number;
}

export interface ReviewPaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

/** 기사님 전체 활성 리뷰 기준 평점 통계 (페이지와 무관) */
export interface ReviewRatingStatistics {
  average: number;
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface MoverReviewCustomer {
  id: string;
  name: string;
}

/** GET /api/review/mover → data.reviews[] */
export interface MoverReviewItem {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  customer: MoverReviewCustomer;
}

export interface MoverReviewsData {
  reviews: MoverReviewItem[];
}

export interface MoverReviewsMeta {
  pagination: ReviewPaginationMeta;
  ratingStatistics: ReviewRatingStatistics;
}

export type MoverReviewsResponse = ApiSuccessResponse<
  MoverReviewsData,
  MoverReviewsMeta
> & {
  meta: MoverReviewsMeta;
};

/** 마이페이지·상세 리뷰 UI용 뷰 모델 */
export interface MoverReviewsViewModel {
  reviews: {
    id: string;
    reviewerName: string;
    createdAt: string;
    rating: number;
    content: string;
  }[];
  reviewStats: ReviewStats;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

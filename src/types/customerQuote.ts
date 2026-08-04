import type { ApiSuccessResponse } from '@/types/api';
import type { ApiMoveType, MoveTypeOption } from '@/types/estimateRequest';

/** 고객 견적 상태 */
export type CustomerQuoteStatus = 'PENDING' | 'CONFIRMED';

/** 고객 견적 응답의 기사님 카드 (BE) */
export interface CustomerQuoteMover {
  moverId: string;
  nickname: string;
  profileImage: string | null;
  rating: number;
  reviewCount: number;
  career: number | null;
  confirmedQuoteCount: number;
  favoriteCount: number;
  isFavorited: boolean;
}

/** 고객 견적 목록 아이템 (BE) */
export interface CustomerQuoteItem {
  quoteId: number;
  price: number | null;
  status: CustomerQuoteStatus;
  isDesignated: boolean;
  mover: CustomerQuoteMover;
}

/** 대기 중인 견적 리스트 data (BE) — 요청 없으면 null */
export interface CustomerPendingQuotesData {
  estimateRequestId: number;
  status: 'SUBMITTED';
  submittedAt: string | null;
  serviceType: ApiMoveType | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  quoteCount: {
    general: number;
    designated: number;
  };
  quotes: CustomerQuoteItem[];
}

export type CustomerPendingQuotesResponse =
  ApiSuccessResponse<CustomerPendingQuotesData | null>;

/** 고객 견적 상세 (BE) */
export interface CustomerQuoteDetail {
  quoteId: number;
  estimateRequestId: number;
  price: number | null;
  comment: string | null;
  status: CustomerQuoteStatus;
  isDesignated: boolean;
  serviceType: ApiMoveType | null;
  moveDate: string | null;
  submittedAt: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  mover: CustomerQuoteMover;
}

export type CustomerQuoteDetailResponse =
  ApiSuccessResponse<CustomerQuoteDetail>;

/** 견적 확정 응답 */
export type ConfirmCustomerQuoteResponse = ApiSuccessResponse<{
  confirmedQuoteId: number;
}>;

/** 기사님 카드 UI 모델 */
export interface CustomerQuoteMoverViewModel {
  moverId: string;
  nickname: string;
  profileImageUrl: string | null;
  ratingLabel: string;
  reviewCountLabel: string;
  careerLabel: string | null;
  confirmedCountLabel: string;
  favoriteCount: number;
  favoriteCountLabel: string;
  isFavorited: boolean;
}

/** 대기 중 견적 카드 UI 모델 */
export interface PendingQuoteCardModel {
  quoteId: number;
  moveType: MoveTypeOption | null;
  isDesignated: boolean;
  moveDate: string;
  departure: string;
  arrival: string;
  priceLabel: string;
  mover: CustomerQuoteMoverViewModel;
}

/** 대기 중 요청 요약 UI 모델 */
export interface PendingRequestSummaryModel {
  estimateRequestId: number;
  serviceLabel: string;
  requestedAtLabel: string;
  moveDateLabel: string;
  from: string;
  to: string;
}

/** 대기 중 견적 목록 페이지 UI 모델 */
export interface PendingQuotesPageModel {
  summary: PendingRequestSummaryModel | null;
  quotes: PendingQuoteCardModel[];
  isWaitingForQuotes: boolean;
}

/** 고객 견적 상세 UI 모델 */
export interface CustomerQuoteDetailViewModel {
  quoteId: number;
  estimateRequestId: number;
  moveType: MoveTypeOption | null;
  isDesignated: boolean;
  isPending: boolean;
  isConfirmed: boolean;
  priceLabel: string;
  comment: string | null;
  serviceLabel: string;
  requestedAtLabel: string;
  moveDateLabel: string;
  departure: string;
  arrival: string;
  mover: CustomerQuoteMoverViewModel;
}

import type { ApiSuccessResponse } from '@/types/api';
import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';
import type { ApiMoveType, MoveTypeOption } from '@/types/estimateRequest';

/** 고객 견적 상태 */
export type CustomerQuoteStatus = 'PENDING' | 'CONFIRMED';

/** 받았던 견적 필터 */
export type CustomerPastQuoteFilter = 'ALL' | 'CONFIRMED';

/** 고객 견적 응답의 기사님 카드 (BE) */
export interface CustomerQuoteMover {
  moverId: string;
  name: string;
  /** 공개/CDN URL. 이미지 없으면 null */
  profileImage: string | null;
  shortDescription: string | null;
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

/** 받았던 견적 그룹 (BE) */
export interface CustomerPastQuoteGroup {
  estimateRequestId: number;
  status: EstimateRequestStatus;
  submittedAt: string | null;
  /** 견적 확정 시각 ISO */
  confirmedAt: string | null;
  serviceType: ApiMoveType | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  quotes: CustomerQuoteItem[];
}

/** 받았던 견적 리스트 응답 meta */
export interface CustomerPastQuotesMeta {
  nextCursor: number | null;
  hasNextPage: boolean;
}

/** 받았던 견적 리스트 응답 (BE) */
export interface CustomerPastQuotesResponse {
  data: {
    items: CustomerPastQuoteGroup[];
  };
  meta: CustomerPastQuotesMeta;
}

/** 받았던 견적 조회 파라미터 */
export interface CustomerPastQuotesParams {
  cursor?: number;
  limit?: number;
  filter?: CustomerPastQuoteFilter;
  estimateRequestId?: number;
}

/** 고객 견적 상세 (BE) */
export interface CustomerQuoteDetail {
  quoteId: number;
  estimateRequestId: number;
  price: number | null;
  comment: string | null;
  status: CustomerQuoteStatus;
  isDesignated: boolean;
  estimateRequestStatus: EstimateRequestStatus;
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
  name: string;
  profileImageUrl: string | null;
  shortDescription: string | null;
  averageRating: number;
  reviewCount: number;
  career: number | null;
  confirmedCount: number;
  favoriteCount: number;
  isFavorited: boolean;
}

/** 견적 정보 섹션 공통 UI 모델 */
export interface QuoteInfoViewModel {
  requestedAtLabel: string;
  serviceLabel: string;
  moveDateLabel: string;
  departure: string;
  arrival: string;
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

/** 받았던 견적 카드 UI 모델 */
export interface ReceivedQuoteCardModel {
  quoteId: number;
  moveType: MoveTypeOption | null;
  isDesignated: boolean;
  isConfirmed: boolean;
  shortDescription: string | null;
  priceLabel: string;
  mover: CustomerQuoteMoverViewModel;
}

/** 받았던 견적 그룹 UI 모델 */
export interface ReceivedQuoteGroupModel {
  estimateRequestId: number;
  info: QuoteInfoViewModel;
  quotes: ReceivedQuoteCardModel[];
}

/** 이용 내역(확정 견적) 카드 UI 모델 */
export interface HistoryQuoteCardModel {
  quoteId: number;
  moverName: string;
  moveType: MoveTypeOption | null;
  isConfirmed: boolean;
  isDesignated: boolean;
  moveDate: string;
  departure: string;
  arrival: string;
  priceLabel: string;
  relativeTimeLabel: string;
  estimateRequestStatus: EstimateRequestStatus;
  isMoveCompleted: boolean;
}

/** 고객 견적 상세 UI 모델 */
export interface CustomerQuoteDetailViewModel {
  quoteId: number;
  estimateRequestId: number;
  moveType: MoveTypeOption | null;
  isDesignated: boolean;
  isPending: boolean;
  isConfirmed: boolean;
  /** 활성 SUBMITTED 요청의 PENDING 견적만 확정 가능 */
  canConfirm: boolean;
  /** 과거 미확정 견적 안내 배너 */
  showUnconfirmedBanner: boolean;
  priceLabel: string;
  comment: string | null;
  serviceLabel: string;
  requestedAtLabel: string;
  moveDateLabel: string;
  departure: string;
  arrival: string;
  mover: CustomerQuoteMoverViewModel;
}

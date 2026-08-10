import type { ApiSuccessResponse } from '@/types/api';
import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';
import type { ApiMoveType, MoveTypeOption } from '@/types/estimateRequest';

/** 견적 상태 */
export type QuoteStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

/** 견적 목록 status 쿼리 */
export type QuoteListStatus = 'SENT' | 'REJECTED';

/** 견적 보내기 요청 본문 */
export interface ProposalQuoteBody {
  type: 'PROPOSAL';
  price: number;
  comment: string;
}

/** 반려 요청 본문 */
export interface RejectionQuoteBody {
  type: 'REJECTION';
  rejectReason: string;
}

export type QuoteSubmitBody = ProposalQuoteBody | RejectionQuoteBody;

/** 견적 제출 응답 data */
export interface QuoteSubmitResult {
  id: number;
  estimateRequestId: number;
  moverId: string;
  price: number | null;
  comment: string | null;
  rejectReason: string | null;
  status: QuoteStatus;
  isDesignated: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type QuoteSubmitResponse = ApiSuccessResponse<QuoteSubmitResult>;

/** 보낸 견적 / 반려 목록 조회 파라미터 */
export interface MoverQuotesParams {
  status: QuoteListStatus;
  page?: number;
  limit?: number;
}

/** 보낸/반려 견적 목록 아이템 공통 필드 (BE) */
export interface QuoteListItemBase {
  id: number;
  estimateRequestId: number;
  customer: { name: string };
  moveType: ApiMoveType | null;
  isDesignated: boolean;
  /** EstimateDesignatedMover.id — 지정 채팅방 생성용. 비지정이면 null */
  designatedMoverId: number | null;
  moveDate: string | null;
  fromRegionLabel: string | null;
  toRegionLabel: string | null;
  createdAt: string;
}

/** 반려한 견적 목록 아이템 (BE) */
export type RejectedQuoteListItem = QuoteListItemBase;

/** 보낸 견적 목록 아이템 (BE) */
export interface SentQuoteListItem extends QuoteListItemBase {
  isConfirmed: boolean;
  price: number | null;
  estimateRequestStatus: EstimateRequestStatus;
  isMoveCompleted: boolean;
}

/** 견적 목록 meta */
export interface QuoteListMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** 견적 목록 아이템 유니온 */
export type QuoteListItem = SentQuoteListItem | RejectedQuoteListItem;

/** 견적 목록 응답 */
export type QuoteListResponse<TItem extends QuoteListItem = QuoteListItem> =
  ApiSuccessResponse<{ items: TItem[] }, QuoteListMeta> & {
    meta: QuoteListMeta;
  };

/** 보낸 견적 카드 UI 모델 */
export interface SentQuoteCardModel {
  id: number;
  customerName: string;
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

/** 반려 요청 카드 UI 모델 */
export interface RejectedQuoteCardModel {
  id: number;
  customerName: string;
  moveType: MoveTypeOption | null;
  isDesignated: boolean;
  moveDate: string;
  departure: string;
  arrival: string;
}

/** 견적 상세 (BE) */
export interface QuoteDetail {
  id: number;
  estimateRequestId: number;
  price: number | null;
  status: QuoteStatus;
  rejectReason: string | null;
  estimateRequestStatus: EstimateRequestStatus;
  isMoveCompleted: boolean;
  customer: { name: string };
  moveType: ApiMoveType | null;
  isDesignated: boolean;
  /** EstimateDesignatedMover.id — 지정 채팅방 생성용. 비지정이면 null */
  designatedMoverId: number | null;
  requestedAt: string | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

export type QuoteDetailResponse = ApiSuccessResponse<QuoteDetail>;

/** 견적 상세 카드 UI 모델 */
export interface QuoteDetailViewModel {
  id: number;
  estimateRequestId: number;
  customerName: string;
  moveType: MoveTypeOption | null;
  isConfirmed: boolean;
  isRejected: boolean;
  isDesignated: boolean;
  designatedMoverId: number | null;
  estimateRequestStatus: EstimateRequestStatus;
  isMoveCompleted: boolean;
  /** 채팅하기 CTA — 닫힌·반려 견적이면 false */
  canStartChat: boolean;
  priceLabel: string;
  rejectReason: string | null;
  requestedAtLabel: string;
  serviceLabel: string;
  moveDateLabel: string;
  departure: string;
  arrival: string;
  summaryDeparture: string;
  summaryArrival: string;
}

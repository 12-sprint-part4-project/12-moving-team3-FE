import type { ApiSuccessResponse } from '@/types/api';
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

/** 반려한 견적 목록 아이템 (BE) */
export interface RejectedQuoteListItem {
  id: number;
  estimateRequestId: number;
  customer: { name: string };
  moveType: ApiMoveType | null;
  isDesignated: boolean;
  moveDate: string | null;
  fromRegionLabel: string | null;
  toRegionLabel: string | null;
  createdAt: string;
}

/** 보낸 견적 목록 아이템 (BE) */
export interface SentQuoteListItem {
  id: number;
  estimateRequestId: number;
  customer: { name: string };
  moveType: ApiMoveType | null;
  isConfirmed: boolean;
  isDesignated: boolean;
  moveDate: string | null;
  fromRegionLabel: string | null;
  toRegionLabel: string | null;
  price: number | null;
  isMoveCompleted: boolean;
  createdAt: string;
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

/** 견적 목록 응답 */
export type QuoteListResponse = ApiSuccessResponse<
  { items: RejectedQuoteListItem[] | SentQuoteListItem[] },
  QuoteListMeta
> & {
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
  isMoveCompleted: boolean;
  customer: { name: string };
  moveType: ApiMoveType | null;
  isDesignated: boolean;
  requestedAt: string | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

export type QuoteDetailResponse = ApiSuccessResponse<QuoteDetail>;

/** 견적 상세 카드 UI 모델 */
export interface QuoteDetailViewModel {
  id: number;
  customerName: string;
  moveType: MoveTypeOption | null;
  isConfirmed: boolean;
  isRejected: boolean;
  isDesignated: boolean;
  isMoveCompleted: boolean;
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

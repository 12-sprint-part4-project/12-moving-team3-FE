import type { ApiSuccessResponse } from '@/types/api';

/** 견적 상태 */
export type QuoteStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

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

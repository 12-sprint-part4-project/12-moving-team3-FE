import type { CreateEstimateChatRoomRequest } from '@/types/chat';
import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';

/**
 * 채팅 CTA 숨김·방 생성 차단 대상 (BE #246 가드와 정합).
 * 해당 상태면 전 화면에서 `채팅하기` 비노출.
 */
const CLOSED_ESTIMATE_REQUEST_STATUSES: ReadonlySet<EstimateRequestStatus> =
  new Set(['EXPIRED', 'CANCELED', 'COMPLETED']);

/** 닫힌 견적요청이면 true — 이용내역·견적상세·기사 견적상세 CTA 분기용 */
export const isEstimateRequestClosedForChat = (
  status: EstimateRequestStatus
): boolean => CLOSED_ESTIMATE_REQUEST_STATUSES.has(status);

export interface BuildEstimateChatRoomBodyParams {
  moverId: string;
  isDesignated: boolean;
  estimateRequestId: number;
  designatedMoverId?: number | null;
  quoteId?: number | null;
}

/** 견적·요청 모델에서 채팅 시작 params 구성 */
export const toStartEstimateChatParams = (
  source: {
    isDesignated: boolean;
    estimateRequestId: number;
    designatedMoverId?: number | null;
    quoteId?: number | null;
  },
  moverId: string
): BuildEstimateChatRoomBodyParams => ({
  moverId,
  isDesignated: source.isDesignated,
  estimateRequestId: source.estimateRequestId,
  designatedMoverId: source.designatedMoverId,
  quoteId: source.quoteId,
});

/**
 * POST /api/chat/rooms body 구성.
 * - GENERAL: moverId + estimateRequestId + quoteId?(있으면)
 * - DESIGNATED: 위 + designatedMoverId 필수 (없으면 null → CTA/호출 차단)
 */
export const buildEstimateChatRoomBody = (
  params: BuildEstimateChatRoomBodyParams
): CreateEstimateChatRoomRequest | null => {
  if (params.isDesignated) {
    if (params.designatedMoverId == null) {
      return null;
    }

    return {
      moverId: params.moverId,
      roomType: 'DESIGNATED',
      estimateRequestId: params.estimateRequestId,
      designatedMoverId: params.designatedMoverId,
      ...(params.quoteId != null ? { quoteId: params.quoteId } : {}),
    };
  }

  return {
    moverId: params.moverId,
    roomType: 'GENERAL',
    estimateRequestId: params.estimateRequestId,
    ...(params.quoteId != null ? { quoteId: params.quoteId } : {}),
  };
};

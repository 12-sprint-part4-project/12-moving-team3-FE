import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';

/** 견적 카드 종료 오버레이 문구 — Figma Card-list/이사완료 */
export const CLOSED_QUOTE_OVERLAY_MESSAGE: Partial<
  Record<EstimateRequestStatus, string>
> = {
  COMPLETED: '이사 완료된 견적이에요',
  EXPIRED: '만료된 견적이에요',
  CANCELED: '취소된 견적이에요',
};

export const getClosedQuoteOverlayMessage = (
  status: EstimateRequestStatus
): string =>
  CLOSED_QUOTE_OVERLAY_MESSAGE[status] ?? '이사 완료된 견적이에요';

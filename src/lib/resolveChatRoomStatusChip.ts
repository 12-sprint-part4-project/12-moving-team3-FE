import { isEstimateRequestClosedForChat } from '@/lib/startEstimateChat';

import type { ChatRoomType } from '@/types/chat';
import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';
import type { QuoteStatus } from '@/types/quote';

export type ChatRoomStatusChipView =
  | { kind: 'community' }
  | { kind: 'closedEstimate'; estimateRequestStatus: EstimateRequestStatus }
  | { kind: 'quote'; quoteStatus: QuoteStatus }
  | { kind: 'designated' }
  | { kind: 'none' };

export interface ResolveChatRoomStatusChipParams {
  roomType: ChatRoomType;
  quoteStatus: QuoteStatus | null;
  estimateRequestStatus: EstimateRequestStatus | null;
}

/** 채팅방 상태 칩 표시 우선순위를 결정한다. */
export const resolveChatRoomStatusChip = ({
  roomType,
  quoteStatus,
  estimateRequestStatus,
}: ResolveChatRoomStatusChipParams): ChatRoomStatusChipView => {
  if (roomType === 'COMMUNITY') {
    return { kind: 'community' };
  }

  if (
    estimateRequestStatus != null &&
    isEstimateRequestClosedForChat(estimateRequestStatus)
  ) {
    return { kind: 'closedEstimate', estimateRequestStatus };
  }

  if (quoteStatus) {
    return { kind: 'quote', quoteStatus };
  }

  if (roomType === 'DESIGNATED') {
    return { kind: 'designated' };
  }

  return { kind: 'none' };
};

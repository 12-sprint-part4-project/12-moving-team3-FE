'use client';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { useTranslation } from '@/i18n/useTranslation';
import { resolveChatRoomStatusChip } from '@/lib/resolveChatRoomStatusChip';
import { cn } from '@/lib/utils';

import type { ChatRoomType } from '@/types/chat';
import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';
import type { QuoteStatus } from '@/types/quote';

export interface ChatRoomStatusChipProps {
  roomType: ChatRoomType;
  quoteStatus: QuoteStatus | null;
  estimateRequestStatus: EstimateRequestStatus | null;
  size?: 'sm' | 'md';
  className?: string;
}

const QUOTE_STATUS_CHIP_TYPE = {
  PENDING: 'quotePending',
  CONFIRMED: 'quoteConfirmed',
  REJECTED: 'quoteRejected',
} as const;

/**
 * 채팅방 상태 칩.
 * COMMUNITY → 가구나눔
 * 종료 견적 요청(EXPIRED/CANCELED/COMPLETED) → 종료 칩
 * quoteStatus → 견적 대기/확정/반려
 * DESIGNATED + 견적 미연결 → 지정 요청
 */
export const ChatRoomStatusChip = ({
  roomType,
  quoteStatus,
  estimateRequestStatus,
  size = 'sm',
  className,
}: ChatRoomStatusChipProps) => {
  const { t } = useTranslation();
  const chipView = resolveChatRoomStatusChip({
    roomType,
    quoteStatus,
    estimateRequestStatus,
  });

  if (chipView.kind === 'community') {
    return (
      <MoveTypeChip
        type="furnitureShare"
        size={size}
        className={cn('shrink-0', className)}
      />
    );
  }

  if (chipView.kind === 'closedEstimate') {
    return (
      <MoveTypeChip
        type="quoteClosed"
        size={size}
        className={cn('shrink-0', className)}
      >
        {t(`chat.closedEstimate.${chipView.estimateRequestStatus}`)}
      </MoveTypeChip>
    );
  }

  if (chipView.kind === 'quote') {
    return (
      <MoveTypeChip
        type={QUOTE_STATUS_CHIP_TYPE[chipView.quoteStatus]}
        size={size}
        className={cn('shrink-0', className)}
      />
    );
  }

  if (chipView.kind === 'designated') {
    return (
      <MoveTypeChip
        type="designated"
        size={size}
        className={cn('shrink-0', className)}
      >
        {t('chat.designatedRequest')}
      </MoveTypeChip>
    );
  }

  return null;
};

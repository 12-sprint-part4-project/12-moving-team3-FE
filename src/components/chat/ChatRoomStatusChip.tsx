'use client';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { ChatRoomType } from '@/types/chat';
import type { QuoteStatus } from '@/types/quote';

export interface ChatRoomStatusChipProps {
  roomType: ChatRoomType;
  quoteStatus: QuoteStatus | null;
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
 * COMMUNITY → 가구나눔 (커뮤니티와 동일 노란 칩)
 * DESIGNATED + 견적 미연결 → 지정 요청
 * quoteStatus → 견적 대기/확정/반려 (지정 여부 표기 없음)
 */
export const ChatRoomStatusChip = ({
  roomType,
  quoteStatus,
  size = 'sm',
  className,
}: ChatRoomStatusChipProps) => {
  const { t } = useTranslation();

  if (roomType === 'COMMUNITY') {
    return (
      <MoveTypeChip
        type="furnitureShare"
        size={size}
        className={cn('shrink-0', className)}
      />
    );
  }

  if (quoteStatus) {
    return (
      <MoveTypeChip
        type={QUOTE_STATUS_CHIP_TYPE[quoteStatus]}
        size={size}
        className={cn('shrink-0', className)}
      />
    );
  }

  if (roomType === 'DESIGNATED') {
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

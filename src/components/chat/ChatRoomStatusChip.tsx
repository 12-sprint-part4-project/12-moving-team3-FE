'use client';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
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
 * COMMUNITY → 가구나눔
 * DESIGNATED + 견적 미연결 → 지정 요청
 * quoteStatus → 견적 대기/확정/반려 (지정 여부 표기 없음)
 */
export const ChatRoomStatusChip = ({
  roomType,
  quoteStatus,
  size = 'sm',
  className,
}: ChatRoomStatusChipProps) => {
  if (roomType === 'COMMUNITY') {
    return (
      <MoveTypeChip
        type="quotePending"
        size={size}
        className={cn('shrink-0', className)}
      >
        가구나눔
      </MoveTypeChip>
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
        지정 요청
      </MoveTypeChip>
    );
  }

  return null;
};

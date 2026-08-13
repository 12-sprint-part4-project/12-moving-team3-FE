'use client';

import { Button } from '@/components/Button/Button';
import { QuoteDetailMobileActionBar } from '@/components/quotes/QuoteDetailMobileActionBar';
import { cn } from '@/lib/utils';

export interface MoverQuoteDetailActionsProps {
  canStartChat: boolean;
  isChatPending?: boolean;
  onChatClick: () => void;
  variant: 'desktop' | 'mobile';
  className?: string;
}

/** 기사님 견적 상세 채팅 액션 */
export const MoverQuoteDetailActions = ({
  canStartChat,
  isChatPending = false,
  onChatClick,
  variant,
  className = '',
}: MoverQuoteDetailActionsProps) => {
  if (!canStartChat) {
    return null;
  }

  const chatLabel = isChatPending ? '연결 중...' : '채팅하기';

  if (variant === 'desktop') {
    return (
      <div className={cn('w-full', className)}>
        <Button
          size="md"
          variant="outlined"
          disabled={isChatPending}
          onClick={onChatClick}
        >
          {chatLabel}
        </Button>
      </div>
    );
  }

  return (
    <QuoteDetailMobileActionBar className={className}>
      <Button
        size="sm"
        variant="solid"
        className="w-full"
        disabled={isChatPending}
        onClick={onChatClick}
      >
        {chatLabel}
      </Button>
    </QuoteDetailMobileActionBar>
  );
};

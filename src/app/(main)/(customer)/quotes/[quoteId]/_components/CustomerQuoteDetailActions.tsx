'use client';

import { Button } from '@/components/Button/Button';
import { ChatStartButtonContent } from '@/components/chat/ChatStartButtonContent';
import { FavoriteButton } from '@/components/Favorite';
import { QuoteDetailMobileActionBar } from '@/components/quotes/QuoteDetailMobileActionBar';
import { cn } from '@/lib/utils';

export interface CustomerQuoteDetailActionsProps {
  /** 확정 CTA 노출 (활성 SUBMITTED + PENDING) */
  canConfirm: boolean;
  /** 채팅하기 CTA — 데스크톱은 확정 버튼 아래, 모바일은 하단 고정바 */
  canStartChat?: boolean;
  isConfirming: boolean;
  isChatPending?: boolean;
  isFavorited: boolean;
  isFavoritePending?: boolean;
  onConfirm: () => void;
  onChatClick?: () => void;
  onToggleFavorite: () => void;
  /** desktop=사이드바 확정·채팅 CTA / mobile=하단 고정바 */
  variant: 'desktop' | 'mobile';
  className?: string;
}

interface QuoteActionButtonsProps extends Pick<
  CustomerQuoteDetailActionsProps,
  | 'canConfirm'
  | 'canStartChat'
  | 'isConfirming'
  | 'isChatPending'
  | 'isFavorited'
  | 'isFavoritePending'
  | 'onConfirm'
  | 'onChatClick'
  | 'onToggleFavorite'
  | 'className'
> {
  confirmLabel: string;
}

/** `/quotes/[quoteId]` 데스크톱 CTA. */
const DesktopQuoteActions = ({
  canConfirm,
  canStartChat,
  isConfirming,
  isChatPending,
  onConfirm,
  onChatClick,
  className = '',
  confirmLabel,
}: QuoteActionButtonsProps) => (
  <div className={cn('flex w-full flex-col gap-4', className)}>
    {canConfirm ? (
      <Button
        size="md"
        variant="solid"
        disabled={isConfirming}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
    ) : null}
    {canStartChat ? (
      <Button
        size="md"
        variant="outlined"
        disabled={isChatPending}
        aria-busy={isChatPending}
        onClick={onChatClick}
      >
        <ChatStartButtonContent isPending={isChatPending} />
      </Button>
    ) : null}
  </div>
);

/** `/quotes/[quoteId]` 모바일 하단바. */
const MobileQuoteActions = ({
  canConfirm,
  canStartChat,
  isConfirming,
  isChatPending,
  isFavorited,
  isFavoritePending,
  onConfirm,
  onChatClick,
  onToggleFavorite,
  className = '',
  confirmLabel,
}: QuoteActionButtonsProps) => (
  <QuoteDetailMobileActionBar className={className}>
    {canConfirm ? (
      <>
        <FavoriteButton
          variant="icon-only"
          isFavorited={isFavorited}
          isPending={isFavoritePending}
          onClick={onToggleFavorite}
        />
        <Button
          size="sm"
          variant="solid"
          className="flex-1"
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        {canStartChat ? (
          <Button
            size="sm"
            variant="outlined"
            className="flex-1"
            disabled={isChatPending}
            aria-busy={isChatPending}
            onClick={onChatClick}
          >
            <ChatStartButtonContent isPending={isChatPending} />
          </Button>
        ) : null}
      </>
    ) : (
      <Button
        size="sm"
        variant="solid"
        className="w-full"
        disabled={isChatPending}
        aria-busy={isChatPending}
        onClick={onChatClick}
      >
        <ChatStartButtonContent isPending={isChatPending} />
      </Button>
    )}
  </QuoteDetailMobileActionBar>
);

/** `/quotes/[quoteId]` 확정·찜·채팅 액션. */
export const CustomerQuoteDetailActions = ({
  canConfirm,
  canStartChat = false,
  isConfirming,
  isChatPending = false,
  isFavorited,
  isFavoritePending = false,
  onConfirm,
  onChatClick,
  onToggleFavorite,
  variant,
  className = '',
}: CustomerQuoteDetailActionsProps) => {
  /** 노출할 CTA가 없으면 렌더하지 않음 */
  if (!canConfirm && !canStartChat) {
    return null;
  }

  const actionProps: QuoteActionButtonsProps = {
    canConfirm,
    canStartChat,
    isConfirming,
    isChatPending,
    isFavorited,
    isFavoritePending,
    onConfirm,
    onChatClick,
    onToggleFavorite,
    className,
    confirmLabel: isConfirming ? '확정 중...' : '견적 확정하기',
  };

  // desktop 사이드바 CTA 또는 mobile 하단 고정바
  return variant === 'desktop' ? (
    <DesktopQuoteActions {...actionProps} />
  ) : (
    <MobileQuoteActions {...actionProps} />
  );
};

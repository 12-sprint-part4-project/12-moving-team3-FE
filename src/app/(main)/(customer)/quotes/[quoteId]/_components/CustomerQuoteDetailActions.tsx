'use client';

import { Button } from '@/components/Button/Button';
import { FavoriteButton } from '@/components/Favorite';
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

/** 견적 상세 확정·찜·채팅 액션 */
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
  if (variant === 'desktop') {
    if (!canConfirm && !canStartChat) {
      return null;
    }

    return (
      <div className={cn('flex w-full flex-col gap-4', className)}>
        {canConfirm ? (
          <Button
            size="md"
            variant="solid"
            disabled={isConfirming}
            onClick={onConfirm}
          >
            {isConfirming ? '확정 중...' : '견적 확정하기'}
          </Button>
        ) : null}
        {canStartChat ? (
          <Button
            size="md"
            variant="outlined"
            disabled={isChatPending}
            onClick={onChatClick}
          >
            {isChatPending ? '연결 중...' : '채팅하기'}
          </Button>
        ) : null}
      </div>
    );
  }

  // 확정·채팅 모두 없으면 하단 고정바 숨김
  if (!canConfirm && !canStartChat) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] lg:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
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
              {isConfirming ? '확정 중...' : '견적 확정하기'}
            </Button>
            {canStartChat ? (
              <Button
                size="sm"
                variant="outlined"
                className="flex-1"
                disabled={isChatPending}
                onClick={onChatClick}
              >
                {isChatPending ? '연결 중...' : '채팅하기'}
              </Button>
            ) : null}
          </>
        ) : (
          <Button
            size="sm"
            variant="solid"
            className="w-full"
            disabled={isChatPending}
            onClick={onChatClick}
          >
            {isChatPending ? '연결 중...' : '채팅하기'}
          </Button>
        )}
      </div>
    </div>
  );
};

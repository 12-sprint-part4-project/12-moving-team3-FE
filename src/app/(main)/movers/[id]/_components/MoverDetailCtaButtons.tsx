'use client';

import { Button } from '@/components/Button/Button';
import { ChatStartButtonContent } from '@/components/chat/ChatStartButtonContent';
import { FavoriteButton } from '@/components/Favorite';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type {
  MoverDetailChat,
  MoverDetailDesignated,
  MoverDetailFavorite,
} from '../_lib/moverDetailActions';

export interface MoverDetailCtaButtonsProps {
  layout: 'sidebar' | 'bottomBar';
  favorite: MoverDetailFavorite;
  designated: MoverDetailDesignated;
  chat: MoverDetailChat;
  /** sidebar 안내 문구용 */
  name?: string;
}

/** 기사 상세 — 찜·지정 견적·채팅 CTA (사이드바/하단바 공용) */
export const MoverDetailCtaButtons = ({
  layout,
  favorite,
  designated,
  chat,
  name,
}: MoverDetailCtaButtonsProps) => {
  const { t } = useTranslation();
  const isHardDisabled =
    designated.isPending ||
    designated.isAlreadyDesignated ||
    designated.isStatusLoading ||
    designated.isRequestFailed;
  const isSoftBlocked =
    (designated.hasReceivedQuoteFromMover || designated.isQuoteStatusError) &&
    !isHardDisabled;
  const buttonSize = layout === 'sidebar' ? 'md' : 'sm';
  const isBottomBar = layout === 'bottomBar';

  if (isBottomBar && !designated.showCta) {
    return (
      <FavoriteButton
        variant="labeled"
        isFavorited={favorite.isFavorited}
        isPending={favorite.isFavoritePending}
        onClick={favorite.onFavoriteClick}
        className="text-lg-semibold"
      />
    );
  }

  return (
    <>
      {layout === 'sidebar' && designated.showCta && name ? (
        <p className="text-xl-semibold text-black-400">
          {t('movers.designatedHint', { name })}
        </p>
      ) : null}
      <FavoriteButton
        variant={layout === 'sidebar' ? 'labeled' : 'icon-only'}
        isFavorited={favorite.isFavorited}
        isPending={favorite.isFavoritePending}
        onClick={favorite.onFavoriteClick}
      />
      {designated.showCta ? (
        <Button
          type="button"
          variant="solid"
          size={buttonSize}
          onClick={designated.onClick}
          disabled={isHardDisabled}
          aria-disabled={isHardDisabled || isSoftBlocked}
          aria-busy={designated.isPending || designated.isStatusLoading}
          className={cn(
            isBottomBar && 'flex-1',
            isSoftBlocked && 'cursor-not-allowed bg-gray-100 hover:bg-gray-100'
          )}
        >
          {designated.isRequestFailed
            ? t('movers.designated.unavailable')
            : designated.isAlreadyDesignated
              ? t('movers.designated.done')
              : designated.isQuoteStatusError
                ? t('movers.designated.checkFailed')
                : designated.hasReceivedQuoteFromMover
                  ? t('movers.designated.unavailable')
                  : designated.isPending
                    ? t('movers.designated.requesting')
                    : designated.isStatusLoading
                      ? t('movers.designated.checking')
                      : t('movers.designated.request')}
        </Button>
      ) : null}
      {chat.showCta ? (
        <Button
          type="button"
          variant="outlined"
          size={buttonSize}
          onClick={chat.onClick}
          disabled={chat.isPending}
          aria-busy={chat.isPending}
          className={isBottomBar ? 'flex-1' : undefined}
        >
          <ChatStartButtonContent isPending={chat.isPending} />
        </Button>
      ) : null}
    </>
  );
};

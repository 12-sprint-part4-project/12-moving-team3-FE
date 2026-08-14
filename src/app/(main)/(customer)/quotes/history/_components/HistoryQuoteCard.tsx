'use client';

import Link from 'next/link';

import { Button, getButtonClassName } from '@/components/Button/Button';
import { getClosedQuoteOverlayMessage } from '@/components/quotes/closedQuoteOverlay';
import { QuoteListCard } from '@/components/quotes/QuoteListCard';
import { cn } from '@/lib/utils';

import { HISTORY_QUOTE_CTA_CLASS } from '../../_components/customerQuotesStyles';

import type { HistoryQuoteCardModel } from '@/types/customerQuote';

export interface HistoryQuoteCardProps {
  quote: HistoryQuoteCardModel;
  /** 채팅방 생성 중인 견적 id */
  pendingChatQuoteId?: number | null;
  onChatClick?: () => void;
  className?: string;
}

/** `/quotes/history` 이용 내역 카드. - 상세·채팅 CTA / 닫힌 요청은 오버레이. */
export const HistoryQuoteCard = ({
  quote,
  pendingChatQuoteId = null,
  onChatClick,
  className = '',
}: HistoryQuoteCardProps) => {
  const detailHref = `/quotes/${quote.quoteId}`;

  /** COMPLETED·EXPIRED·CANCELED면 오버레이만 노출 */
  const isClosedCard = quote.isMoveCompleted;
  const isChatPending = pendingChatQuoteId === quote.quoteId;

  // QuoteListCard — 열린 카드는 상세/채팅 CTA, 닫힌 카드는 오버레이만
  return (
    <QuoteListCard
      className={className}
      displayName={quote.moverName}
      nameSuffix="기사님"
      moveType={quote.moveType}
      isConfirmed={quote.isConfirmed}
      isDesignated={quote.isDesignated}
      moveDate={quote.moveDate}
      departure={quote.departure}
      arrival={quote.arrival}
      priceLabel={quote.priceLabel}
      relativeTimeLabel={quote.relativeTimeLabel}
      detailHref={detailHref}
      detailAriaLabel={`${quote.moverName} 기사님 견적 상세보기`}
      isClosed={isClosedCard}
      overlayMessage={
        isClosedCard
          ? getClosedQuoteOverlayMessage(quote.estimateRequestStatus)
          : undefined
      }
      footerActions={
        isClosedCard ? undefined : (
          <>
            <Link
              href={detailHref}
              className={getButtonClassName({
                size: 'md',
                variant: 'outlined',
                className: cn(
                  HISTORY_QUOTE_CTA_CLASS,
                  'focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none'
                ),
              })}
              aria-label={`${quote.moverName} 기사님 견적 상세보기`}
            >
              상세보기
            </Link>
            {quote.canStartChat ? (
              <Button
                size="md"
                variant="solid"
                className={HISTORY_QUOTE_CTA_CLASS}
                disabled={isChatPending}
                onClick={onChatClick}
                aria-label={`${quote.moverName} 기사님과 채팅하기`}
              >
                {isChatPending ? '연결 중...' : '채팅하기'}
              </Button>
            ) : null}
          </>
        )
      }
    />
  );
};

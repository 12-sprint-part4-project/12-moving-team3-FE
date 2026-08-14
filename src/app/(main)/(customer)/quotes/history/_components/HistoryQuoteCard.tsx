'use client';

import Link from 'next/link';

import { Button, getButtonClassName } from '@/components/Button/Button';
import { getClosedQuoteOverlayMessage } from '@/components/quotes/closedQuoteOverlay';
import { QuoteListCard } from '@/components/quotes/QuoteListCard';
import { cn } from '@/lib/utils';

import type { HistoryQuoteCardModel } from '@/types/customerQuote';

export interface HistoryQuoteCardProps {
  quote: HistoryQuoteCardModel;
  isChatPending?: boolean;
  onChatClick?: () => void;
  className?: string;
}

const CTA_CLASS =
  'h-12 w-full rounded-lg text-lg-semibold md:flex-1 lg:h-14 lg:rounded-2xl lg:text-xl-semibold';

/** `/quotes/history` 이용 내역 카드. - 상세·채팅 CTA / 닫힌 요청은 오버레이. */
export const HistoryQuoteCard = ({
  quote,
  isChatPending = false,
  onChatClick,
  className = '',
}: HistoryQuoteCardProps) => {
  const detailHref = `/quotes/${quote.quoteId}`;
  /** COMPLETED·EXPIRED·CANCELED면 오버레이만 노출 */
  const isClosedCard = quote.isMoveCompleted;

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
                  CTA_CLASS,
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
                className={CTA_CLASS}
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

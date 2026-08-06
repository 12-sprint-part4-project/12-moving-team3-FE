'use client';

import { QuoteListCard } from '@/components/quotes/QuoteListCard';
import { getClosedQuoteOverlayMessage } from '@/components/quotes/closedQuoteOverlay';
import type { HistoryQuoteCardModel } from '@/types/customerQuote';

export interface HistoryQuoteCardProps {
  quote: HistoryQuoteCardModel;
  className?: string;
}

/** 고객 이용 내역 카드 */
export const HistoryQuoteCard = ({
  quote,
  className = '',
}: HistoryQuoteCardProps) => {
  const detailHref = `/quotes/${quote.quoteId}`;
  const isClosedCard = quote.isMoveCompleted;

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
    />
  );
};

'use client';

import { getClosedQuoteOverlayMessage } from '@/components/quotes/closedQuoteOverlay';
import { QuoteListCard } from '@/components/quotes/QuoteListCard';

import type { SentQuoteCardModel } from '@/types/quote';

export interface SentQuoteCardProps {
  quote: SentQuoteCardModel;
  className?: string;
}

/** 보낸 견적 카드 */
export const SentQuoteCard = ({
  quote,
  className = '',
}: SentQuoteCardProps) => {
  const detailHref = `/mover/quotes/${quote.id}`;
  const isClosedCard = quote.isMoveCompleted;

  return (
    <QuoteListCard
      className={className}
      displayName={quote.customerName}
      nameSuffix="고객님"
      moveType={quote.moveType}
      isConfirmed={quote.isConfirmed}
      isDesignated={quote.isDesignated}
      moveDate={quote.moveDate}
      departure={quote.departure}
      arrival={quote.arrival}
      priceLabel={quote.priceLabel}
      relativeTimeLabel={quote.relativeTimeLabel}
      detailHref={detailHref}
      detailAriaLabel={`${quote.customerName} 고객님 견적 상세보기`}
      isClosed={isClosedCard}
      overlayMessage={
        isClosedCard
          ? getClosedQuoteOverlayMessage(quote.estimateRequestStatus)
          : undefined
      }
    />
  );
};

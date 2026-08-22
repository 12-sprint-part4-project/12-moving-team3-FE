'use client';

import { QuoteListCard } from '@/components/quotes/QuoteListCard';
import { useTranslation } from '@/i18n/useTranslation';

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
  const { t } = useTranslation();
  const detailHref = `/mover/quotes/${quote.id}`;
  const isClosedCard = quote.isMoveCompleted;

  return (
    <QuoteListCard
      className={className}
      displayName={quote.customerName}
      nameSuffix={t('gnb.role.customer')}
      moveType={quote.moveType}
      isConfirmed={quote.isConfirmed}
      isDesignated={quote.isDesignated}
      moveDate={quote.moveDate}
      departure={quote.departure}
      arrival={quote.arrival}
      priceLabel={quote.priceLabel}
      relativeTimeLabel={quote.relativeTimeLabel}
      detailHref={detailHref}
      detailAriaLabel={t('quotes.detailAriaCustomer', {
        name: quote.customerName,
      })}
      isClosed={isClosedCard}
      overlayMessage={
        isClosedCard
          ? t(`quotes.closedOverlay.${quote.estimateRequestStatus}`)
          : undefined
      }
    />
  );
};

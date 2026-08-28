'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { MoverProfileBlock } from '@/components/movers/MoverProfileBlock';
import { QuotePriceRow } from '@/components/quotes/QuotePriceRow';
import { QuoteStatusChipRow } from '@/components/quotes/QuoteStatusChips';
import { useTranslation } from '@/i18n/useTranslation';
import { cardHover } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { toMoverCardModelFromCustomerQuoteMover } from '@/services/customerQuoteApi';

import type { ReceivedQuoteCardModel } from '@/types/customerQuote';

export interface ReceivedQuoteCardProps {
  quote: ReceivedQuoteCardModel;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending?: (moverId: string) => boolean;
  className?: string;
}

/** `/quotes?tab=received` 받았던 견적 카드. */
export const ReceivedQuoteCard = ({
  quote,
  onFavoriteClick,
  isMoverPending,
  className = '',
}: ReceivedQuoteCardProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const mover = toMoverCardModelFromCustomerQuoteMover(quote.mover);
  const detailHref = `/quotes/${quote.quoteId}`;

  const isFavoritePending = isMoverPending?.(quote.mover.moverId) ?? false;

  // 칩·소개·프로필·견적가 + 상세 stretched link
  return (
    <motion.article
      {...(shouldReduceMotion ? {} : cardHover)}
      className={cn(
        'relative flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:py-5',
        className
      )}
    >
      <QuoteStatusChipRow
        status={quote.isConfirmed ? 'confirmed' : null}
        moveType={quote.moveType}
        isDesignated={quote.isDesignated}
      />

      {quote.shortDescription ? (
        <p className="text-lg-semibold text-black-300 lg:text-xl-semibold">
          {quote.shortDescription}
        </p>
      ) : null}

      <MoverProfileBlock
        mover={mover}
        disableNavigation
        onFavoriteClick={onFavoriteClick}
        isFavoritePending={isFavoritePending}
      />

      <QuotePriceRow priceLabel={quote.priceLabel} />

      {/* stretched link — 찜 버튼(z-10)과 형제로 두어 Link 안 버튼 중첩 방지 */}
      <Link
        href={detailHref}
        className="absolute inset-0 z-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        aria-label={t('quotes.detailAriaMover', { name: mover.name })}
      />
    </motion.article>
  );
};

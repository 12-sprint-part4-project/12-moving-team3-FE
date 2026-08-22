'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { QuoteCardInfo } from '@/components/quotes/QuoteCardInfo';
import { QuoteStatusChips } from '@/components/quotes/QuoteStatusChips';
import { useTranslation } from '@/i18n/useTranslation';
import { cardHover } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { RejectedQuoteCardModel } from '@/types/quote';

export interface RejectedQuoteCardProps {
  quote: RejectedQuoteCardModel;
  className?: string;
}

/** 반려 요청 카드 */
export const RejectedQuoteCard = ({
  quote,
  className = '',
}: RejectedQuoteCardProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const detailHref = `/mover/quotes/${quote.id}`;

  return (
    <motion.article
      {...(shouldReduceMotion ? {} : cardHover)}
      className={cn(
        'relative flex w-full flex-col gap-3.5 overflow-hidden rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3.5 lg:gap-4">
        <div className="flex w-full items-center gap-2 lg:gap-3">
          <QuoteStatusChips
            moveType={quote.moveType}
            isDesignated={quote.isDesignated}
            size="sm"
          />
        </div>

        <QuoteCardInfo
          displayName={quote.customerName}
          moveDate={quote.moveDate}
          departure={quote.departure}
          arrival={quote.arrival}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-300 bg-black-500/65">
        <p className="text-lg-semibold text-white lg:text-2lg-semibold">
          {t('quotes.rejectedOverlay')}
        </p>
        <Link
          href={detailHref}
          aria-label={t('quotes.rejectedDetailAria', {
            name: quote.customerName,
          })}
          className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 px-4 py-2 text-md-semibold text-blue-300 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-[1.125rem] lg:py-2.5 lg:text-lg-semibold"
        >
          {t('quotes.viewDetail')}
        </Link>
      </div>
    </motion.article>
  );
};

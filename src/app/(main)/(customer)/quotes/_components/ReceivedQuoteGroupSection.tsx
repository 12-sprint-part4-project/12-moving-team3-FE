'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { QuoteInfoRows } from '@/components/quotes/QuoteInfoRows';
import { useTranslation } from '@/i18n/useTranslation';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { ReceivedQuoteCard } from './ReceivedQuoteCard';
import { ReceivedQuotesFilter } from './ReceivedQuotesFilter';
import { useReceivedQuoteGroupFilter } from '../_lib/useReceivedQuoteGroupFilter';

import type { ReceivedQuoteGroupModel } from '@/types/customerQuote';

export interface ReceivedQuoteGroupSectionProps {
  group: ReceivedQuoteGroupModel;
  /** 첫 데이터 로드 시에만 목록 entrance stagger (탭 전환 시 false) */
  staggerOnEntrance?: boolean;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending?: (moverId: string) => boolean;
  className?: string;
}

/** `/quotes?tab=received` 요청 그룹 블록. - 견적 정보·필터·카드 목록. */
export const ReceivedQuoteGroupSection = ({
  group,
  staggerOnEntrance = false,
  onFavoriteClick,
  isMoverPending,
  className = '',
}: ReceivedQuoteGroupSectionProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  /** 그룹 로컬 필터·필터 변경 stagger */
  const { filter, visibleQuotes, shouldStaggerList, handleFilterChange } =
    useReceivedQuoteGroupFilter(group.quotes, staggerOnEntrance);

  const motionTransition = getMotionTransition(shouldReduceMotion);

  // 견적 정보 + 그룹 필터 + 견적서 카드(또는 필터 빈 문구)
  return (
    <section
      className={cn(
        'flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-6 md:gap-8 md:px-8 md:py-8 lg:gap-10 lg:px-10 lg:py-12',
        className
      )}
      aria-labelledby={`received-group-${group.estimateRequestId}-info`}
    >
      {/* 요청 견적 정보 */}
      <div className="flex w-full flex-col gap-4 lg:gap-8">
        <h2
          id={`received-group-${group.estimateRequestId}-info`}
          className="text-lg-semibold text-black-400 lg:text-2xl-semibold"
        >
          {t('quotes.info')}
        </h2>
        <QuoteInfoRows info={group.info} variant="group" />
      </div>

      {/* 그룹 내 필터 + 견적서 목록 */}
      <div className="flex w-full flex-col gap-3 md:gap-4 lg:gap-6">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
          {t('quotes.quoteList')}
        </h2>
        <ReceivedQuotesFilter
          value={filter}
          onValueChange={handleFilterChange}
        />
        <AnimatePresence mode="wait" initial={false}>
          {visibleQuotes.length > 0 ? (
            <motion.ul
              key={filter}
              variants={shouldStaggerList ? listStagger : undefined}
              initial={shouldStaggerList ? 'hidden' : false}
              animate={shouldStaggerList ? 'show' : undefined}
              exit={{ opacity: 0 }}
              transition={motionTransition}
              className="flex w-full flex-col gap-6 lg:gap-8"
            >
              {visibleQuotes.map((quote) => (
                <motion.li
                  key={quote.quoteId}
                  variants={shouldStaggerList ? fadeUp : undefined}
                  transition={motionTransition}
                >
                  <ReceivedQuoteCard
                    quote={quote}
                    onFavoriteClick={onFavoriteClick}
                    isMoverPending={isMoverPending}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p
              key={`empty-${filter}`}
              variants={fadeIn}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={motionTransition}
              className="py-10 text-center text-lg-regular text-gray-400"
            >
              {filter === 'CONFIRMED'
                ? t('quotes.noConfirmedQuotes')
                : t('quotes.noReceivedQuotes')}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

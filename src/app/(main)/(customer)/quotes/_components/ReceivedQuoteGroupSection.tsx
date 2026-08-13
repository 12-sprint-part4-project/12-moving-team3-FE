'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { QuoteInfoRows } from '@/components/quotes/QuoteInfoRows';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import type {
  CustomerPastQuoteFilter,
  ReceivedQuoteCardModel,
  ReceivedQuoteGroupModel,
} from '@/types/customerQuote';

import { ReceivedQuoteCard } from './ReceivedQuoteCard';
import { ReceivedQuotesFilter } from './ReceivedQuotesFilter';

/** 그룹 내 필터 적용 */
const filterQuotesByStatus = (
  quotes: ReceivedQuoteCardModel[],
  filter: CustomerPastQuoteFilter
): ReceivedQuoteCardModel[] =>
  filter === 'CONFIRMED' ? quotes.filter((quote) => quote.isConfirmed) : quotes;

export interface ReceivedQuoteGroupSectionProps {
  group: ReceivedQuoteGroupModel;
  /** 첫 데이터 로드 시에만 목록 entrance stagger (탭 전환 시 false) */
  staggerOnEntrance?: boolean;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending?: (moverId: string) => boolean;
  className?: string;
}

/**
 * 받았던 견적 블록
 */
export const ReceivedQuoteGroupSection = ({
  group,
  staggerOnEntrance = false,
  onFavoriteClick,
  isMoverPending,
  className = '',
}: ReceivedQuoteGroupSectionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const [filter, setFilter] = useState<CustomerPastQuoteFilter>('ALL');
  /** 필터 변경으로 remount된 목록만 stagger */
  const [staggerOnFilter, setStaggerOnFilter] = useState(false);
  const visibleQuotes = filterQuotesByStatus(group.quotes, filter);
  const shouldStaggerList = staggerOnEntrance || staggerOnFilter;

  const handleFilterChange = (next: CustomerPastQuoteFilter) => {
    setStaggerOnFilter(true);
    setFilter(next);
  };

  return (
    <section
      className={cn(
        'flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-6 md:gap-8 md:px-8 md:py-8 lg:gap-10 lg:px-10 lg:py-12',
        className
      )}
      aria-labelledby={`received-group-${group.estimateRequestId}-info`}
    >
      <div className="flex w-full flex-col gap-4 lg:gap-8">
        <h2
          id={`received-group-${group.estimateRequestId}-info`}
          className="text-lg-semibold text-black-400 lg:text-2xl-semibold"
        >
          견적 정보
        </h2>
        <QuoteInfoRows info={group.info} variant="group" />
      </div>

      {/* 이 그룹 안에서만 필터 */}
      <div className="flex w-full flex-col gap-3 md:gap-4 lg:gap-6">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
          견적서 목록
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
                    isFavoritePending={isMoverPending?.(quote.mover.moverId)}
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
                ? '확정한 견적서가 없어요.'
                : '받은 견적서가 없어요.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

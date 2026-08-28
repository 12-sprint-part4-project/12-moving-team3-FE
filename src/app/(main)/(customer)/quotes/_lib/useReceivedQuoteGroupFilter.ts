'use client';

import { useState } from 'react';

import { filterReceivedQuotesByStatus } from './filterReceivedQuotesByStatus';

import type {
  CustomerPastQuoteFilter,
  ReceivedQuoteCardModel,
} from '@/types/customerQuote';

/** `/quotes?tab=received` 그룹 필터 훅. - 필터 값·목록·stagger 플래그. */
export const useReceivedQuoteGroupFilter = (
  quotes: ReceivedQuoteCardModel[],
  staggerOnEntrance: boolean
) => {
  const [filter, setFilter] = useState<CustomerPastQuoteFilter>('ALL');
  /** 필터 변경으로 remount된 목록만 stagger */
  const [staggerOnFilter, setStaggerOnFilter] = useState(false);

  const visibleQuotes = filterReceivedQuotesByStatus(quotes, filter);

  const shouldStaggerList = staggerOnEntrance || staggerOnFilter;

  const handleFilterChange = (next: CustomerPastQuoteFilter) => {
    setStaggerOnFilter(true);
    setFilter(next);
  };

  return {
    filter,
    visibleQuotes,
    shouldStaggerList,
    handleFilterChange,
  };
};

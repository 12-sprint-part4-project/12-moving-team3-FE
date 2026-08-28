'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

import { FilterButton } from '@/components/ui/Filter/FilterButton';
import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { Sort } from '@/components/ui/Sort/Sort';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeUp, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { ALL_MOVE_TYPES, ALL_SCOPES } from '@/types/estimateRequest';

import { RequestsFilterResetButton } from './RequestsFilterResetButton';
import { REQUESTS_SORT_OPTIONS } from '../_lib/filterOptions';
import {
  isDefaultRequestsListUrlState,
  isRequestsSortValue,
  type RequestsListUrlState,
} from '../_lib/requestsListSearchParams';
import { useRequestsListSearch } from '../_lib/useRequestsListSearch';

import type { RequestsSortValue } from '@/types/estimateRequest';

export interface RequestsListToolbarProps {
  listFilters: RequestsListUrlState;
  onCommitKeyword: (keyword: string) => void;
  /** 디바운스된 검색어 — API 조회용 (타이핑마다 부모 리렌더 방지) */
  onQueryChange: (keyword: string) => void;
  onResetAll: () => void;
  /** 외부 초기화 시 draft 동기화용 */
  resetSignal?: number;
  totalCount: number;
  showListFetching: boolean;
  onSortChange: (value: string) => void;
  onSortOpen?: () => void;
  onSortOptionPrefetch?: (value: RequestsSortValue) => void;
  onFilterOpen: () => void;
  className?: string;
}

/**
 * 검색 draft를 내부에서 관리해 타이핑 시 목록·카드 리렌더를 막는 툴바.
 */
export const RequestsListToolbar = ({
  listFilters,
  onCommitKeyword,
  onQueryChange,
  onResetAll,
  resetSignal = 0,
  totalCount,
  showListFetching,
  onSortChange,
  onSortOpen,
  onSortOptionPrefetch,
  onFilterOpen,
  className = '',
}: RequestsListToolbarProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const isFilterActive =
    listFilters.moveTypes.length !== ALL_MOVE_TYPES.length ||
    listFilters.scopes.length !== ALL_SCOPES.length;

  const {
    searchInputValue,
    queryKeyword,
    handleSearchChange,
    handleSearch,
    handleSearchClear,
    setSearchDraft,
  } = useRequestsListSearch({
    urlKeyword: listFilters.keyword,
    onCommitKeyword,
  });

  useEffect(() => {
    onQueryChange(queryKeyword);
  }, [onQueryChange, queryKeyword]);

  useEffect(() => {
    if (resetSignal > 0) {
      setSearchDraft('');
    }
  }, [resetSignal, setSearchDraft]);

  const canResetFilters = !isDefaultRequestsListUrlState({
    ...listFilters,
    keyword: searchInputValue.trim(),
  });

  const handleSortOptionPrefetch = (value: string) => {
    if (isRequestsSortValue(value)) {
      onSortOptionPrefetch?.(value);
    }
  };

  const handleReset = () => {
    setSearchDraft('');
    onResetAll();
  };

  const sortOptions = REQUESTS_SORT_OPTIONS.map((option) => ({
    ...option,
    label: t(`receivedRequests.sort.${option.value}`),
  }));

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn('flex w-full flex-col gap-4 lg:gap-6', className)}
    >
      <TextFieldSearch
        size="sm"
        className="w-full max-w-none lg:h-16 lg:gap-2 lg:px-6 lg:py-3.5 lg:[&_button]:size-9 lg:[&_input]:text-xl-regular lg:[&_svg]:size-9"
        placeholder={t('receivedRequests.searchPlaceholder')}
        value={searchInputValue}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        onClear={handleSearchClear}
        aria-label={t('receivedRequests.searchAria')}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="flex shrink-0 items-center gap-2 text-lg-medium text-black-400">
          <span>{t('common.all')}</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={totalCount}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={motionTransition}
              className="inline-block tabular-nums"
            >
              {totalCount}
            </motion.span>
          </AnimatePresence>
          <span>{t('common.countUnit')}</span>
          <AnimatePresence>
            {showListFetching ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={motionTransition}
                className="ml-1 inline-flex items-center"
                role="status"
              >
                <span
                  aria-hidden
                  className="inline-block size-4 animate-spin rounded-full border-2 border-line-100 border-t-blue-300"
                />
                <span className="sr-only">{t('common.updating')}</span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </p>

        <div className="flex min-w-0 items-center gap-2">
          <RequestsFilterResetButton
            onClick={handleReset}
            disabled={!canResetFilters}
          />
          <div className="flex items-center md:hidden">
            <Sort
              options={sortOptions}
              value={listFilters.sort}
              onValueChange={onSortChange}
              onOpen={onSortOpen}
              onOptionPrefetch={handleSortOptionPrefetch}
              size="sm"
            />
          </div>
          <div className="hidden items-center md:flex">
            <Sort
              options={sortOptions}
              value={listFilters.sort}
              onValueChange={onSortChange}
              onOpen={onSortOpen}
              onOptionPrefetch={handleSortOptionPrefetch}
              size="md"
            />
          </div>
          <FilterButton
            aria-label={t('receivedRequests.openFilterAria')}
            active={isFilterActive}
            className="cursor-pointer xl:hidden"
            onClick={onFilterOpen}
          />
        </div>
      </div>
    </motion.div>
  );
};

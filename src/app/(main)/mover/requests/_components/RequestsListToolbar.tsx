'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

import { FilterButton } from '@/components/ui/Filter/FilterButton';
import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { Sort } from '@/components/ui/Sort/Sort';

import { getMotionTransition } from '@/lib/motionVariants';

import type { RequestsSortValue } from '@/types/estimateRequest';

import {
  isDefaultRequestsListUrlState,
  type RequestsListUrlState,
} from '../_lib/requestsListSearchParams';
import { useRequestsListSearch } from '../_lib/useRequestsListSearch';
import { RequestsFilterResetButton } from './RequestsFilterResetButton';

const SORT_OPTIONS: { label: string; value: RequestsSortValue }[] = [
  { label: '이사 빠른순', value: 'moveDateAsc' },
  { label: '요청일 빠른순', value: 'requestDateAsc' },
];

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
  sortValue: RequestsSortValue;
  onSortChange: (value: string) => void;
  isFilterActive: boolean;
  onFilterOpen: () => void;
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
  sortValue,
  onSortChange,
  isFilterActive,
  onFilterOpen,
}: RequestsListToolbarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

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

  const handleReset = () => {
    setSearchDraft('');
    onResetAll();
  };

  return (
    <div className="flex w-full flex-col gap-4 lg:gap-6">
      <TextFieldSearch
        size="sm"
        className="w-full max-w-none lg:h-16 lg:gap-2 lg:px-6 lg:py-3.5 lg:[&_button]:size-9 lg:[&_input]:text-xl-regular lg:[&_svg]:size-9"
        placeholder="고객명 또는 출발지·도착지로 검색해 보세요"
        value={searchInputValue}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        onClear={handleSearchClear}
        aria-label="고객명·출발지·도착지 검색"
      />

      <div className="flex items-center justify-between gap-3">
        <p className="flex shrink-0 items-center gap-2 text-lg-medium text-black-400">
          <span>전체</span>
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
          <span>건</span>
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
                <span className="sr-only">업데이트 중</span>
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
              options={SORT_OPTIONS}
              value={sortValue}
              onValueChange={onSortChange}
              size="sm"
            />
          </div>
          <div className="hidden items-center md:flex">
            <Sort
              options={SORT_OPTIONS}
              value={sortValue}
              onValueChange={onSortChange}
              size="md"
            />
          </div>
          <FilterButton
            aria-label="필터 열기"
            active={isFilterActive}
            className="cursor-pointer xl:hidden"
            onClick={onFilterOpen}
          />
        </div>
      </div>
    </div>
  );
};

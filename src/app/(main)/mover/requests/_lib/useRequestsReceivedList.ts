'use client';

import { useMemo, useState } from 'react';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { useReceivedEstimateRequests } from '@/hooks/useReceivedEstimateRequests';
import { useTranslation } from '@/i18n/useTranslation';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import {
  isDefaultRequestsListUrlState,
  type RequestsListUrlState,
} from './requestsListSearchParams';
import { useFocusRequestInList } from './useFocusRequestInList';

/** 데스크톱 필터 변경 API 조회 디바운스 지연(ms) */
const FILTER_DEBOUNCE_MS = 200;

interface UseRequestsReceivedListParams {
  listFilters: RequestsListUrlState;
  queryKeyword: string;
  focusRequestId?: number | null;
  exitingIds: ReadonlySet<number>;
}

/**
 * `/mover/requests` 목록 Query·무한스크롤·딥링크·화면 파생값.
 * 사이드바 건수와 목록이 같은 Query를 쓰므로 page.client에서 호출한다.
 */
export const useRequestsReceivedList = ({
  listFilters,
  queryKeyword,
  focusRequestId = null,
  exitingIds,
}: UseRequestsReceivedListParams) => {
  const { t } = useTranslation();
  const debouncedMoveTypes = useDebouncedValue(
    listFilters.moveTypes,
    FILTER_DEBOUNCE_MS
  );
  const debouncedScopes = useDebouncedValue(
    listFilters.scopes,
    FILTER_DEBOUNCE_MS
  );

  /** 딥링크 중에는 디바운스된 이전 필터·검색어로 조회하면 대상 카드가 빠진다 */
  const isFocusing = focusRequestId != null;

  const {
    requests,
    totalCount,
    moveTypeCounts,
    scopeCounts,
    isPending,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isEmpty,
  } = useReceivedEstimateRequests({
    keyword: isFocusing ? listFilters.keyword : queryKeyword,
    moveTypes: isFocusing ? listFilters.moveTypes : debouncedMoveTypes,
    scopes: isFocusing ? listFilters.scopes : debouncedScopes,
    sort: listFilters.sort,
  });

  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: '200px 0px',
  });

  useFocusRequestInList({
    focusRequestId,
    requests,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
    refetch,
    listFilters: {
      ...listFilters,
      keyword: isFocusing ? listFilters.keyword : queryKeyword,
    },
  });

  /** 정렬·필터 변경 시에만 목록 entrance 애니메이션 (검색어 제외) */
  const listAnimationKey = useMemo(
    () =>
      [
        listFilters.sort,
        debouncedMoveTypes.join(','),
        debouncedScopes.join(','),
      ].join('|'),
    [listFilters.sort, debouncedMoveTypes, debouncedScopes]
  );

  const displayRequests = useMemo(
    () => requests.filter((request) => !exitingIds.has(request.id)),
    [exitingIds, requests]
  );

  const errorMessage = resolveApiErrorMessage(
    error,
    t('receivedRequests.listError')
  );

  const isFilteredEmpty =
    isEmpty &&
    (!isDefaultRequestsListUrlState({
      ...listFilters,
      keyword: queryKeyword,
      moveTypes: debouncedMoveTypes,
      scopes: debouncedScopes,
    }) ||
      debouncedMoveTypes.length === 0);

  const showListFetching = isFetching && !isPending && !isFetchingNextPage;
  /**
   * keepPreviousData 재조회 중에는 이전 key를 유지한다.
   * fetching 시작/완료마다 ul key가 바뀌면 목록이 두 번 리마운트되며 stagger가 중복된다.
   */
  const [settledListAnimationKey, setSettledListAnimationKey] =
    useState(listAnimationKey);
  if (!showListFetching && settledListAnimationKey !== listAnimationKey) {
    setSettledListAnimationKey(listAnimationKey);
  }

  const handleRetry = () => {
    void refetch();
  };

  return {
    requests,
    displayRequests,
    totalCount,
    moveTypeCounts,
    scopeCounts,
    isPending,
    isFetchingNextPage,
    isError,
    isEmpty,
    isFilteredEmpty,
    hasNextPage,
    loadMoreRef,
    listAnimationKey: showListFetching
      ? settledListAnimationKey
      : listAnimationKey,
    errorMessage,
    showListFetching,
    handleRetry,
  };
};

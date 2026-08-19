'use client';

import { useCallback } from 'react';

import { useReceivedRequestsPrefetch } from '@/hooks/useReceivedRequestsPrefetch';

import { REQUESTS_SORT_OPTIONS } from './filterOptions';

import type { RequestsListUrlState } from './requestsListSearchParams';
import type { RequestsSortValue } from '@/types/estimateRequest';

interface UseRequestsSortPrefetchParams {
  listFilters: RequestsListUrlState;
  queryKeyword: string;
}

/** 받은 요청 정렬 옵션 hover·오픈 시 다른 정렬 목록을 미리 조회 */
export const useRequestsSortPrefetch = ({
  listFilters,
  queryKeyword,
}: UseRequestsSortPrefetchParams) => {
  const { prefetchReceivedList } = useReceivedRequestsPrefetch();

  const prefetchSort = useCallback(
    (sort: RequestsSortValue) => {
      if (sort === listFilters.sort) {
        return;
      }

      prefetchReceivedList({
        keyword: queryKeyword,
        moveTypes: listFilters.moveTypes,
        scopes: listFilters.scopes,
        sort,
      });
    },
    [
      listFilters.moveTypes,
      listFilters.scopes,
      listFilters.sort,
      prefetchReceivedList,
      queryKeyword,
    ]
  );

  const prefetchAllSorts = useCallback(() => {
    REQUESTS_SORT_OPTIONS.forEach((option) => {
      prefetchSort(option.value);
    });
  }, [prefetchSort]);

  return { prefetchSort, prefetchAllSorts };
};

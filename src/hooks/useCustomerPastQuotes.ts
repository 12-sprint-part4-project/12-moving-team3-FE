import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import {
  getCustomerPastQuotes,
  toHistoryQuoteCardModels,
  toReceivedQuoteGroupModel,
} from '@/services/customerQuoteApi';
import type { CustomerPastQuoteFilter } from '@/types/customerQuote';

/** 받았던 견적 — 견적 요청 그룹 페이지 크기 */
export const PAST_QUOTE_GROUP_LIMIT = 4;

/** 이용 내역 — 확정 견적 그룹 페이지 크기 */
export const HISTORY_PAST_QUOTE_GROUP_LIMIT = 8;

export interface UseCustomerPastQuotesOptions {
  /** false면 조회하지 않음 (예: 대기 중 탭) */
  enabled?: boolean;
  limit?: number;
  /** ALL: 받았던 견적 / CONFIRMED: 이용 내역(확정 견적) */
  filter?: CustomerPastQuoteFilter;
}

/**
 * 고객 받았던 견적 — 견적 요청 그룹을 커서 기반 무한 스크롤로 조회
 * filter에 따라 groups 또는 historyCards만 매핑
 */
export const useCustomerPastQuotes = ({
  enabled = true,
  limit = PAST_QUOTE_GROUP_LIMIT,
  filter = 'ALL',
}: UseCustomerPastQuotesOptions = {}) => {
  const query = useInfiniteQuery({
    queryKey: customerQuoteQueryKeys.past({ limit, filter }),
    queryFn: ({ pageParam }) =>
      getCustomerPastQuotes({
        filter,
        limit,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const groups = useMemo(() => {
    if (filter !== 'ALL') {
      return [];
    }
    return (
      query.data?.pages.flatMap((page) =>
        page.data.items.map(toReceivedQuoteGroupModel)
      ) ?? []
    );
  }, [filter, query.data]);

  const historyCards = useMemo(() => {
    if (filter !== 'CONFIRMED') {
      return [];
    }
    return (
      query.data?.pages.flatMap((page) =>
        page.data.items.flatMap(toHistoryQuoteCardModels)
      ) ?? []
    );
  }, [filter, query.data]);

  const isEmptyList =
    filter === 'CONFIRMED' ? historyCards.length === 0 : groups.length === 0;

  return {
    ...query,
    groups,
    historyCards,
    isEmpty: !query.isPending && !query.isError && isEmptyList,
    isHistoryEmpty:
      !query.isPending && !query.isError && historyCards.length === 0,
  };
};

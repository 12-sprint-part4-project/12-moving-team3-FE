import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import {
  getCustomerPastQuotes,
  toReceivedQuoteGroupModel,
} from '@/services/customerQuoteApi';

/** 견적 정보(요청) 그룹 페이지 크기 */
export const PAST_QUOTE_GROUP_LIMIT = 4;

export interface UseCustomerPastQuotesOptions {
  /** false면 조회하지 않음 (예: 대기 중 탭) */
  enabled?: boolean;
  limit?: number;
}

/**
 * 고객 받았던 견적 — 견적 요청 그룹을 커서 기반 무한 스크롤로 조회
 * filter는 그룹 단위 UI에서 클라이언트 필터링
 */
export const useCustomerPastQuotes = ({
  enabled = true,
  limit = PAST_QUOTE_GROUP_LIMIT,
}: UseCustomerPastQuotesOptions = {}) => {
  const query = useInfiniteQuery({
    queryKey: customerQuoteQueryKeys.past({ limit }),
    queryFn: ({ pageParam }) =>
      getCustomerPastQuotes({
        filter: 'ALL',
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

  const groups = useMemo(
    () =>
      query.data?.pages.flatMap((page) =>
        page.data.items.map(toReceivedQuoteGroupModel)
      ) ?? [],
    [query.data]
  );

  return {
    ...query,
    groups,
    isEmpty: !query.isPending && !query.isError && groups.length === 0,
  };
};

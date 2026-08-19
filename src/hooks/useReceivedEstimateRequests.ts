import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  buildReceivedEstimateRequestsInfiniteQuery,
  RECEIVED_ESTIMATE_REQUESTS_PAGE_SIZE,
  RECEIVED_ESTIMATE_REQUESTS_STALE_TIME_MS,
} from '@/lib/receivedEstimateRequestsQuery';
import {
  toMoveTypeFilterCounts,
  toReceivedRequestCardModel,
  toScopeFilterCounts,
} from '@/services/estimateRequestApi';

import type { ReceivedEstimateRequestsQueryInput } from '@/lib/receivedEstimateRequestsQuery';

export type UseReceivedEstimateRequestsParams =
  ReceivedEstimateRequestsQueryInput;

/**
 * 기사님 받은 요청 목록 무한 스크롤 조회 훅
 * - 이사 유형 미선택: 목록·건수는 0건. 범위 필터 건수(서비스지역·지정)도 0. 이사 유형 건수 조회는 유지
 * - 이사 유형 전체 선택: moveType 미전달 → 유형 전체
 * - 범위 미선택: serviceArea/designated 미전달 → BE 기본(아직 안 보낸·유효한 전부)
 * - 범위 전체 선택: 둘 다 true → 지정 ∪ 서비스지역
 */
export const useReceivedEstimateRequests = ({
  keyword,
  moveTypes,
  scopes,
  sort,
  limit = RECEIVED_ESTIMATE_REQUESTS_PAGE_SIZE,
}: UseReceivedEstimateRequestsParams) => {
  const { user, isReady } = useAuth();
  const isMoverReady = isReady && user?.userType === 'MOVER';
  const hasSelectedMoveTypes = moveTypes.length > 0;

  const infiniteQuery = useMemo(
    () =>
      buildReceivedEstimateRequestsInfiniteQuery({
        keyword,
        moveTypes,
        scopes,
        sort,
        limit,
      }),
    [keyword, moveTypes, scopes, sort, limit]
  );

  const query = useInfiniteQuery({
    ...infiniteQuery,
    enabled: isMoverReady,
    staleTime: RECEIVED_ESTIMATE_REQUESTS_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });

  const requests = useMemo(() => {
    if (!hasSelectedMoveTypes) {
      return [];
    }

    return (
      query.data?.pages.flatMap((page) =>
        page.data.items.map(toReceivedRequestCardModel)
      ) ?? []
    );
  }, [hasSelectedMoveTypes, query.data]);

  const totalCount = hasSelectedMoveTypes
    ? (query.data?.pages[0]?.meta.totalCount ?? 0)
    : 0;

  const moveTypeCounts = useMemo(() => {
    const counts = query.data?.pages[0]?.meta.filterCounts.moveType;
    if (!counts) {
      return undefined;
    }
    return toMoveTypeFilterCounts(counts);
  }, [query.data]);

  const scopeCounts = useMemo(() => {
    if (!hasSelectedMoveTypes) {
      return { serviceArea: 0, designated: 0 };
    }

    const counts = query.data?.pages[0]?.meta.filterCounts;
    if (!counts) {
      return undefined;
    }
    return toScopeFilterCounts(counts);
  }, [hasSelectedMoveTypes, query.data]);

  return {
    ...query,
    requests,
    totalCount,
    moveTypeCounts,
    scopeCounts,
    isEmpty: !query.isPending && !query.isError && requests.length === 0,
  };
};

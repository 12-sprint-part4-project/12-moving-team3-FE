import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  getReceivedEstimateRequests,
  toMoveTypeFilterCounts,
  toReceivedRequestCardModel,
  toScopeFilterCounts,
} from '@/services/estimateRequestApi';
import type {
  MoveTypeOption,
  ReceivedEstimateRequestsParams,
  RequestScopeOption,
  RequestsSortValue,
} from '@/types/estimateRequest';

/** 필터 배열을 정렬해 queryKey·요청 파라미터를 안정화 */
const toStableOptions = <T extends string>(items: readonly T[]): T[] =>
  [...items].sort();

export const estimateRequestQueryKeys = {
  all: ['estimate-requests'] as const,
  receivedLists: () => [...estimateRequestQueryKeys.all, 'received'] as const,
  receivedList: (params: Omit<ReceivedEstimateRequestsParams, 'cursor'>) =>
    [...estimateRequestQueryKeys.receivedLists(), params] as const,
};

export interface UseReceivedEstimateRequestsParams {
  keyword?: string;
  moveTypes: MoveTypeOption[];
  scopes: RequestScopeOption[];
  sort: RequestsSortValue;
  limit?: number;
}

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
  limit = 10,
}: UseReceivedEstimateRequestsParams) => {
  const hasSelectedMoveTypes = moveTypes.length > 0;
  const hasSelectedScopes = scopes.length > 0;

  const stableMoveTypes = useMemo(
    () => (hasSelectedMoveTypes ? toStableOptions(moveTypes) : []),
    [moveTypes, hasSelectedMoveTypes]
  );
  const stableScopes = useMemo(
    () => (hasSelectedScopes ? toStableOptions(scopes) : []),
    [scopes, hasSelectedScopes]
  );

  const queryParams = useMemo(
    () => ({
      keyword: keyword?.trim() || undefined,
      moveTypes: hasSelectedMoveTypes ? stableMoveTypes : undefined,
      scopes: hasSelectedScopes ? stableScopes : undefined,
      sort,
      limit,
    }),
    [
      keyword,
      hasSelectedMoveTypes,
      stableMoveTypes,
      hasSelectedScopes,
      stableScopes,
      sort,
      limit,
    ]
  );

  const query = useInfiniteQuery({
    queryKey: estimateRequestQueryKeys.receivedList({
      ...queryParams,
      // 미선택([])과 전체 선택(전체 배열)이 같은 키가 되지 않도록 구분
      moveTypes: hasSelectedMoveTypes ? stableMoveTypes : [],
      scopes: hasSelectedScopes ? stableScopes : [],
    }),
    queryFn: ({ pageParam }) =>
      getReceivedEstimateRequests({
        ...queryParams,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
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

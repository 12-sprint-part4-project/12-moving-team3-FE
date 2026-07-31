import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  getMovers,
  toMoverCardModelFromListItem,
} from '@/services/moversApi';
import type {
  ApiMoveType,
  ApiRegion,
  MoversListParams,
  MoversSortValue,
} from '@/types/mover';
import { SORT_VALUE_TO_API } from '@/types/mover';

/** 필터 배열을 정렬해 queryKey·요청 파라미터를 안정화 */
const toStableOptions = <T extends string>(items: readonly T[]): T[] =>
  [...items].sort();

export const moverQueryKeys = {
  all: ['movers'] as const,
  lists: () => [...moverQueryKeys.all, 'list'] as const,
  list: (params: Omit<MoversListParams, 'cursor'>) =>
    [...moverQueryKeys.lists(), params] as const,
  details: () => [...moverQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...moverQueryKeys.details(), id] as const,
};

export interface UseMoversListParams {
  keyword?: string;
  regions?: ApiRegion[];
  moveTypes?: ApiMoveType[];
  sort?: MoversSortValue;
  limit?: number;
}

/**
 * 기사님 목록 무한 스크롤 조회.
 * - 지역·서비스 미선택: 해당 쿼리 생략 → 전체 조회
 * - 기본 정렬: 최신순(createdAt desc)
 */
export const useMoversList = ({
  keyword,
  regions = [],
  moveTypes = [],
  sort = 'createdAtDesc',
  limit = 10,
}: UseMoversListParams) => {
  const stableRegions = useMemo(
    () => toStableOptions(regions),
    [regions]
  );
  const stableMoveTypes = useMemo(
    () => toStableOptions(moveTypes),
    [moveTypes]
  );

  const { sort: apiSort, order: apiOrder } = SORT_VALUE_TO_API[sort];

  const queryParams = useMemo(
    (): Omit<MoversListParams, 'cursor'> => ({
      keyword: keyword?.trim() || undefined,
      regions: stableRegions.length > 0 ? stableRegions : undefined,
      moveTypes: stableMoveTypes.length > 0 ? stableMoveTypes : undefined,
      sort: apiSort,
      order: apiOrder,
      limit,
    }),
    [keyword, stableRegions, stableMoveTypes, apiSort, apiOrder, limit]
  );

  const query = useInfiniteQuery({
    queryKey: moverQueryKeys.list(queryParams),
    queryFn: ({ pageParam }) =>
      getMovers({
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

  const movers = useMemo(
    () =>
      query.data?.pages.flatMap((page) =>
        page.data.items.map(toMoverCardModelFromListItem)
      ) ?? [],
    [query.data]
  );

  return {
    ...query,
    movers,
    isEmpty: !query.isPending && !query.isError && movers.length === 0,
  };
};

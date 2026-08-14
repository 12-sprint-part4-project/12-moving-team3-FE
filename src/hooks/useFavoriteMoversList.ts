import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { favoriteQueryKeys } from '@/constants/queryKey';
import {
  getFavoriteMovers,
  toMoverCardModelFromFavorite,
} from '@/services/moversApi';
import { getMoverAccessToken } from '@/services/moversAuth';

import type { MoverCardModel } from '@/types/mover';

const DEFAULT_LIMIT = 10;

export interface UseFavoriteMoversListParams {
  enabled?: boolean;
  limit?: number;
}

/**
 * 찜한 기사님 목록 무한 스크롤 조회 (CUSTOMER).
 * enabled(로그인)일 때만 요청한다.
 */
export const useFavoriteMoversList = ({
  enabled = true,
  limit = DEFAULT_LIMIT,
}: UseFavoriteMoversListParams = {}) => {
  const query = useInfiniteQuery({
    queryKey: favoriteQueryKeys.list(limit),
    queryFn: ({ pageParam }) =>
      getFavoriteMovers({
        cursor: pageParam,
        limit,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    enabled: enabled && Boolean(getMoverAccessToken()),
  });

  const movers: MoverCardModel[] = useMemo(
    () =>
      query.data?.pages.flatMap((page) =>
        page.data.items
          .map(toMoverCardModelFromFavorite)
          .filter((item): item is MoverCardModel => item != null)
      ) ?? [],
    [query.data]
  );

  return {
    ...query,
    movers,
    isEmpty: !query.isPending && !query.isError && movers.length === 0,
  };
};

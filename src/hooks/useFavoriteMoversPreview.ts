import { useQuery } from '@tanstack/react-query';

import { getMoverAccessToken } from '@/services/moversAuth';
import {
  getFavoriteMovers,
  toMoverCardModelFromFavorite,
} from '@/services/moversApi';
import type { MoverCardModel } from '@/types/mover';

import { moverQueryKeys } from './useMoversList';

const FAVORITE_PREVIEW_LIMIT = 3;

export const favoriteQueryKeys = {
  all: [...moverQueryKeys.all, 'favorites'] as const,
  lists: () => [...favoriteQueryKeys.all, 'list'] as const,
  list: (limit: number) => [...favoriteQueryKeys.lists(), limit] as const,
  preview: (limit: number) =>
    [...favoriteQueryKeys.all, 'preview', limit] as const,
};

/**
 * Desktop 사이드바용 찜한 기사님 미리보기 (최대 3명).
 * enabled(로그인)일 때만 조회한다.
 */
export const useFavoriteMoversPreview = (enabled = true) => {
  const query = useQuery({
    queryKey: favoriteQueryKeys.preview(FAVORITE_PREVIEW_LIMIT),
    queryFn: () => getFavoriteMovers({ limit: FAVORITE_PREVIEW_LIMIT }),
    enabled: enabled && Boolean(getMoverAccessToken()),
  });

  const favorites: MoverCardModel[] =
    query.data?.data.items
      .map(toMoverCardModelFromFavorite)
      .filter((item): item is MoverCardModel => item != null)
      .slice(0, FAVORITE_PREVIEW_LIMIT) ?? [];

  return {
    ...query,
    favorites,
  };
};

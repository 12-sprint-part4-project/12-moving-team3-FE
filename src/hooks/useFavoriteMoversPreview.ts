import { useQuery } from '@tanstack/react-query';

import { getAccessToken } from '@/services/apiClient';
import {
  getFavoriteMovers,
  toMoverCardModelFromFavorite,
} from '@/services/moversApi';
import type { MoverCardModel } from '@/types/mover';

import { moverQueryKeys } from './useMoversList';

const FAVORITE_PREVIEW_LIMIT = 3;

/**
 * Desktop 사이드바용 찜한 기사님 미리보기 (최대 3명).
 * enabled(로그인)일 때만 조회한다.
 */
export const useFavoriteMoversPreview = (enabled = true) => {
  const query = useQuery({
    queryKey: [
      ...moverQueryKeys.all,
      'favorites',
      'preview',
      FAVORITE_PREVIEW_LIMIT,
    ],
    queryFn: () => getFavoriteMovers({ limit: FAVORITE_PREVIEW_LIMIT }),
    enabled: enabled && Boolean(getAccessToken()),
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

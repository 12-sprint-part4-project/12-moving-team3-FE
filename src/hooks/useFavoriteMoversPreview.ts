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
//preview제외하곤 사용된 적은 없음.

/**
 * Desktop 사이드바용 찜한 기사님 미리보기 (최대 3명).
 * enabled(로그인)일 때만 조회한다.
 */
export const useFavoriteMoversPreview = (enabled = true) => {
  const query = useQuery({
    queryKey: favoriteQueryKeys.preview(FAVORITE_PREVIEW_LIMIT),
    queryFn: () => getFavoriteMovers({ limit: FAVORITE_PREVIEW_LIMIT }),
    enabled: enabled && Boolean(getMoverAccessToken()),
    //getMoverAccessToken() : 현재 로그인된 사용자의 Access Token(인증 토큰)을 반환하는 함수입니다. 로그인 상태가 아니면 null을 반환
  });

  const favorites: MoverCardModel[] =
    query.data?.data.items
      .map(toMoverCardModelFromFavorite)
      .filter((item): item is MoverCardModel => item != null)
      .slice(0, FAVORITE_PREVIEW_LIMIT) ?? []; //어차피 3개만 받아오기 때문에 필요 없지만, 그냥 방어 차원..

  return {
    ...query,
    favorites,
  };
};

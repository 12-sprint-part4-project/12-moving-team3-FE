import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import { favoriteQueryKeys } from '@/hooks/useFavoriteMoversPreview';
import { moverQueryKeys } from '@/hooks/useMoversList';
import type {
  CustomerPastQuotesResponse,
  CustomerPendingQuotesResponse,
  CustomerQuoteDetailResponse,
  CustomerQuoteMover,
} from '@/types/customerQuote';
import type { ApiMoveType } from '@/types/estimateRequest';
import type {
  FavoriteMoverListItem,
  FavoriteMoversResponse,
  MoverDetailResponse,
  MoverListItem,
  MoversListResponse,
} from '@/types/mover';
import type { ReviewStats } from '@/types/review';

export interface ToggleFavoriteVariables {
  moverId: string;
  nextFavorited: boolean;
}

/** 찜 카운트 가감 (0 미만 방지) */
export const nextFavoriteCount = (
  count: number,
  nextFavorited: boolean
): number => Math.max(0, count + (nextFavorited ? 1 : -1));

/**
 * 현재 상태 → 목표 상태 기준으로만 카운트 보정.
 * 이미 목표 상태면 카운트를 건드리지 않아 연타 드리프트를 막는다.
 */
export const adjustFavoriteCount = (
  count: number | null | undefined,
  wasFavorited: boolean,
  nextFavorited: boolean
): number | undefined => {
  if (count == null) {
    return undefined;
  }
  if (wasFavorited === nextFavorited) {
    return count;
  }
  return nextFavoriteCount(count, nextFavorited);
};

/** 견적 응답의 기사님 찜 필드 패치 */
export const patchQuoteMover = (
  mover: CustomerQuoteMover,
  moverId: string,
  nextFavorited: boolean
): CustomerQuoteMover => {
  if (mover.moverId !== moverId) {
    return mover;
  }
  if (mover.isFavorited === nextFavorited) {
    return mover;
  }

  return {
    ...mover,
    isFavorited: nextFavorited,
    favoriteCount: nextFavoriteCount(mover.favoriteCount, nextFavorited),
  };
};

/** 관련 쿼리 스냅샷 */
export const snapshotFavoriteQueries = (
  queryClient: QueryClient
): Array<[QueryKey, unknown]> => [
  ...queryClient.getQueriesData({ queryKey: moverQueryKeys.all }),
  ...queryClient.getQueriesData({ queryKey: customerQuoteQueryKeys.all }),
  ...queryClient.getQueriesData({ queryKey: favoriteQueryKeys.lists() }),
  ...queryClient.getQueriesData({
    queryKey: [...favoriteQueryKeys.all, 'preview'],
  }),
];

/** 스냅샷 복원 */
export const restoreFavoriteQueries = (
  queryClient: QueryClient,
  previousQueries: Array<[QueryKey, unknown]>
): void => {
  previousQueries.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

const EMPTY_REVIEW_STATS: ReviewStats = {
  averageRating: null,
  totalCount: 0,
  ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

/** 목록/상세 캐시에서 찜 추가용 아이템 구성 */
const buildOptimisticFavoriteItem = (
  queryClient: QueryClient,
  moverId: string,
  favoritedCount: number
): FavoriteMoverListItem | null => {
  const listQueries = queryClient.getQueriesData<
    InfiniteData<MoversListResponse>
  >({ queryKey: moverQueryKeys.lists() });

  for (const [, data] of listQueries) {
    const item = data?.pages
      .flatMap((page) => page.data.items)
      .find((entry: MoverListItem) => entry.user.id === moverId);

    if (item) {
      return {
        id: -Date.now(),
        userId: item.userId,
        moverId,
        createdAt: new Date().toISOString(),
        mover: {
          id: item.user.id,
          name: item.user.nickname,
          profileImageUrl: item.user.profileImageUrl,
          moverProfile: {
            career: item.career,
            serviceRegions: item.serviceRegions,
            service: item.service,
          },
        },
        reviewStats: item.review,
        favoritedCount,
        service: item.service,
        confirmedCount: item.confirmedCount,
      };
    }
  }

  const detail = queryClient.getQueryData<MoverDetailResponse>(
    moverQueryKeys.detail(moverId)
  );

  if (detail) {
    const { moverDetail, reviewStats } = detail.data;
    return {
      id: -Date.now(),
      userId: moverDetail.userId,
      moverId,
      createdAt: new Date().toISOString(),
      mover: {
        id: moverDetail.user.id,
        name: moverDetail.user.nickname,
        profileImageUrl: moverDetail.user.profileImageUrl,
        moverProfile: {
          career: moverDetail.career,
          serviceRegions: moverDetail.serviceRegions,
          service: moverDetail.service,
        },
      },
      reviewStats,
      favoritedCount,
      service: moverDetail.service,
      confirmedCount: detail.data.confirmedCount,
    };
  }

  // 견적 캐시 — 최소 정보로 preview용 아이템 구성
  // CustomerQuoteMover에는 service가 없으므로 요청/상세의 serviceType을 사용
  interface QuoteMoverSource {
    mover: CustomerQuoteMover;
    service: ApiMoveType[] | null;
  }

  const quoteSource =
    ((): QuoteMoverSource | null => {
      const pending = queryClient.getQueryData<CustomerPendingQuotesResponse>(
        customerQuoteQueryKeys.pending()
      );
      const pendingMover = pending?.data?.quotes.find(
        (quote) => quote.mover.moverId === moverId
      )?.mover;
      if (!pendingMover) {
        return null;
      }
      const serviceType = pending.data?.serviceType ?? null;
      return {
        mover: pendingMover,
        service: serviceType ? [serviceType] : null,
      };
    })() ??
    ((): QuoteMoverSource | null => {
      const pastQueries = queryClient.getQueriesData<
        InfiniteData<CustomerPastQuotesResponse>
      >({ queryKey: [...customerQuoteQueryKeys.all, 'past'] });

      for (const [, past] of pastQueries) {
        for (const page of past?.pages ?? []) {
          for (const group of page.data.items) {
            const found = group.quotes.find((q) => q.mover.moverId === moverId);
            if (found) {
              return {
                mover: found.mover,
                service: group.serviceType ? [group.serviceType] : null,
              };
            }
          }
        }
      }
      return null;
    })() ??
    ((): QuoteMoverSource | null => {
      const detailQueries =
        queryClient.getQueriesData<CustomerQuoteDetailResponse>({
          queryKey: customerQuoteQueryKeys.details(),
        });
      for (const [, quoteDetail] of detailQueries) {
        if (quoteDetail?.data.mover.moverId === moverId) {
          const serviceType = quoteDetail.data.serviceType;
          return {
            mover: quoteDetail.data.mover,
            service: serviceType ? [serviceType] : null,
          };
        }
      }
      return null;
    })();

  if (!quoteSource) {
    return null;
  }

  const { mover: quoteMover, service } = quoteSource;

  // 견적 경로에서 서비스 유형을 알 수 없으면 빈 서비스 카드 대신 낙관적 아이템 생략
  if (!service || service.length === 0) {
    return null;
  }

  const reviewStats: ReviewStats = {
    averageRating: quoteMover.rating,
    totalCount: quoteMover.reviewCount,
    ratingCounts: EMPTY_REVIEW_STATS.ratingCounts,
  };

  return {
    id: -Date.now(),
    userId: moverId,
    moverId,
    createdAt: new Date().toISOString(),
    mover: {
      id: moverId,
      name: quoteMover.nickname,
      profileImageUrl: quoteMover.profileImage,
      moverProfile: {
        career: quoteMover.career,
        serviceRegions: [],
        service,
      },
    },
    reviewStats,
    favoritedCount,
    service,
    confirmedCount: quoteMover.confirmedQuoteCount,
  };
};

const prependFavoriteItem = (
  items: FavoriteMoverListItem[],
  item: FavoriteMoverListItem
): FavoriteMoverListItem[] => {
  if (items.some((entry) => entry.moverId === item.moverId)) {
    return items;
  }
  return [item, ...items];
};

/** 캐시에 찜 상태 낙관적 반영 */
export const applyOptimisticFavorite = (
  queryClient: QueryClient,
  { moverId, nextFavorited }: ToggleFavoriteVariables
): void => {
  let resolvedFavoritedCount = 0;

  queryClient.setQueriesData<InfiniteData<MoversListResponse>>(
    { queryKey: moverQueryKeys.lists() },
    (old) => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.map((item) => {
              if (item.user.id !== moverId) {
                return item;
              }
              if (item.isFavorited === nextFavorited) {
                return item;
              }

              const favoritedCount = adjustFavoriteCount(
                item.favoritedCount,
                item.isFavorited,
                nextFavorited
              );
              if (typeof favoritedCount === 'number') {
                resolvedFavoritedCount = favoritedCount;
              }

              return {
                ...item,
                isFavorited: nextFavorited,
                ...(favoritedCount !== undefined ? { favoritedCount } : {}),
              };
            }),
          },
        })),
      };
    }
  );

  queryClient.setQueryData<MoverDetailResponse>(
    moverQueryKeys.detail(moverId),
    (old) => {
      if (!old) {
        return old;
      }
      if (old.data.isFavorited === nextFavorited) {
        return old;
      }

      const favoritedCount = adjustFavoriteCount(
        old.data.favoritedCount,
        old.data.isFavorited,
        nextFavorited
      );
      if (typeof favoritedCount === 'number') {
        resolvedFavoritedCount = favoritedCount;
      }

      return {
        ...old,
        data: {
          ...old.data,
          isFavorited: nextFavorited,
          ...(favoritedCount !== undefined
            ? { favoritedCount }
            : {}),
        },
      };
    }
  );

  if (!nextFavorited) {
    queryClient.setQueriesData<InfiniteData<FavoriteMoversResponse>>(
      { queryKey: favoriteQueryKeys.lists() },
      (old) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.filter((item) => item.moverId !== moverId),
            },
          })),
        };
      }
    );

    queryClient.setQueriesData<FavoriteMoversResponse>(
      { queryKey: [...favoriteQueryKeys.all, 'preview'] },
      (old) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter((item) => item.moverId !== moverId),
          },
        };
      }
    );
  } else {
    const optimisticItem = buildOptimisticFavoriteItem(
      queryClient,
      moverId,
      resolvedFavoritedCount
    );

    if (optimisticItem) {
      queryClient.setQueriesData<InfiniteData<FavoriteMoversResponse>>(
        { queryKey: favoriteQueryKeys.lists() },
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: {
                      ...page.data,
                      items: prependFavoriteItem(
                        page.data.items,
                        optimisticItem
                      ),
                    },
                  }
                : {
                    ...page,
                    data: {
                      ...page.data,
                      items: page.data.items.filter(
                        (item) => item.moverId !== moverId
                      ),
                    },
                  }
            ),
          };
        }
      );

      queryClient.setQueriesData<FavoriteMoversResponse>(
        { queryKey: [...favoriteQueryKeys.all, 'preview'] },
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            data: {
              ...old.data,
              items: prependFavoriteItem(old.data.items, optimisticItem).slice(
                0,
                3
              ),
            },
          };
        }
      );
    }
  }

  queryClient.setQueryData<CustomerPendingQuotesResponse>(
    customerQuoteQueryKeys.pending(),
    (old) => {
      if (!old?.data) {
        return old;
      }

      return {
        ...old,
        data: {
          ...old.data,
          quotes: old.data.quotes.map((quote) => ({
            ...quote,
            mover: patchQuoteMover(quote.mover, moverId, nextFavorited),
          })),
        },
      };
    }
  );

  queryClient.setQueriesData<InfiniteData<CustomerPastQuotesResponse>>(
    { queryKey: [...customerQuoteQueryKeys.all, 'past'] },
    (old) => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.map((group) => ({
              ...group,
              quotes: group.quotes.map((quote) => ({
                ...quote,
                mover: patchQuoteMover(quote.mover, moverId, nextFavorited),
              })),
            })),
          },
        })),
      };
    }
  );

  queryClient.setQueriesData<CustomerQuoteDetailResponse>(
    { queryKey: customerQuoteQueryKeys.details() },
    (old) => {
      if (!old?.data || old.data.mover.moverId !== moverId) {
        return old;
      }

      return {
        ...old,
        data: {
          ...old.data,
          mover: patchQuoteMover(old.data.mover, moverId, nextFavorited),
        },
      };
    }
  );
};

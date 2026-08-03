'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { MoverCard } from '@/components/movers/MoverCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteMoversList } from '@/hooks/useFavoriteMoversList';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

/** 찜한 기사님 목록 페이지 클라이언트 */
export const FavoritesPageClient = () => {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const isLoggedIn = Boolean(user);
  const {
    toggleFavorite,
    isPending: isFavoritePending,
    variables: favoriteVariables,
  } = useToggleFavorite();

  const {
    movers,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    isEmpty,
    refetch,
  } = useFavoriteMoversList({ enabled: isLoggedIn });

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFavoriteClick = (moverId: string, nextFavorited: boolean) => {
    toggleFavorite(moverId, nextFavorited);
  };

  const handleRetry = () => {
    void refetch();
  };

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : (error?.message ?? '찜한 기사님 목록을 불러오지 못했습니다.');

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  if (!isReady || !user) {
    return (
      <div className="flex w-full justify-center bg-background-200 py-16">
        <Spinner message="로딩 중..." />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-background-200">
      <div
        className={cn(
          'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
          pageXPadding
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          찜한 기사님
        </h1>
      </div>

      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col py-6 md:py-8',
          pageXPadding
        )}
      >
        {isPending ? <Spinner message="찜한 기사님을 불러오는 중..." /> : null}

        {isError ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-lg-medium text-gray-400">{errorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="text-xl-regular text-gray-400">
              찜한 기사님이 없어요
            </p>
            <Link
              href="/movers"
              className="cursor-pointer text-lg-semibold text-blue-300 hover:underline"
            >
              기사님 찾아보기
            </Link>
          </div>
        ) : null}

        {!isError && movers.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
            {movers.map((mover) => (
              <li key={mover.moverId}>
                <MoverCard
                  mover={mover}
                  size="lg"
                  variant="favorite"
                  onFavoriteClick={handleFavoriteClick}
                  isFavoritePending={
                    isFavoritePending &&
                    favoriteVariables?.moverId === mover.moverId
                  }
                />
              </li>
            ))}
          </ul>
        ) : null}

        <div ref={loadMoreRef} className="h-8 w-full">
          {isFetchingNextPage ? (
            <Spinner message="더 불러오는 중..." className="py-6" />
          ) : null}
        </div>
      </div>
    </div>
  );
};

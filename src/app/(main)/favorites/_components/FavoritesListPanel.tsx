'use client';

import { Button } from '@/components/Button/Button';
import { MoverCard } from '@/components/movers/MoverCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useFavoriteMoversList } from '@/hooks/useFavoriteMoversList';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { FavoritesEmptyState } from './FavoritesEmptyState';

export interface FavoritesListPanelProps {
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** `/favorites` 목록 패널. Query·배타 가드·무한스크롤. */
export const FavoritesListPanel = ({
  onFavoriteClick,
  isMoverPending,
}: FavoritesListPanelProps) => {
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
  } = useFavoriteMoversList();

  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: '200px',
  });

  const errorMessage = resolveApiErrorMessage(
    error,
    '찜한 기사님 목록을 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return <Spinner message="찜한 기사님을 불러오는 중..." />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg-medium text-gray-400">{errorMessage}</p>
        <Button
          type="button"
          variant="solid"
          size="sm"
          onClick={handleRetry}
          className="w-auto"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  if (isEmpty) {
    return <FavoritesEmptyState />;
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 tablet:gap-8 xl:grid-cols-2 xl:gap-x-6 xl:gap-y-12">
        {movers.map((mover) => (
          <li key={mover.moverId}>
            <MoverCard
              mover={mover}
              size="lg"
              variant="favorite"
              onFavoriteClick={onFavoriteClick}
              isFavoritePending={isMoverPending(mover.moverId)}
            />
          </li>
        ))}
      </ul>

      {hasNextPage || isFetchingNextPage ? (
        <div ref={loadMoreRef} className="h-8 w-full">
          {isFetchingNextPage ? (
            <Spinner message="더 불러오는 중..." className="py-6" />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

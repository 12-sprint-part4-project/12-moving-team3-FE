'use client';

import { MoverCard } from '@/components/movers/MoverCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useFavoriteMoversList } from '@/hooks/useFavoriteMoversList';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { useTranslation } from '@/i18n/useTranslation';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { FavoritesListStatus } from './FavoritesListStatus';

export interface FavoritesListPanelProps {
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** `/favorites` 목록 패널. Query·배타 가드·무한스크롤. */
export const FavoritesListPanel = ({
  onFavoriteClick,
  isMoverPending,
}: FavoritesListPanelProps) => {
  const { t } = useTranslation();
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
    t('movers.listError')
  );

  const handleRetry = () => {
    void refetch();
  };

  if (isPending || isError || isEmpty) {
    return (
      <FavoritesListStatus
        isPending={isPending}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    );
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
            <Spinner message={t('common.loadMore')} className="py-6" />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

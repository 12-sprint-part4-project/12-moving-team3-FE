'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useInView } from 'react-intersection-observer';

import { MoverCard } from '@/components/movers/MoverCard';
import { Button } from '@/components/Button/Button';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useFavoriteMoversPreview } from '@/hooks/useFavoriteMoversPreview';
import { useMoversList } from '@/hooks/useMoversList';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import {
  isApiMoveType,
  isApiRegion,
  type ApiMoveType,
  type ApiRegion,
  type MoversSortValue,
} from '@/types/mover';

import { MoversSidebar } from './_components/MoversSidebar';
import { MoversToolbar } from './_components/MoversToolbar';

const SEARCH_DEBOUNCE_MS = 300;

/** 기사님 찾기 목록 페이지 클라이언트 */
export const MoversPageClient = () => {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const canUseFavorites = Boolean(user?.isProfileCompleted);
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
  } = useFavoriteAction();

  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] =
    useState<MoversSortValue>('reviewCountDesc');
  const [regionValue, setRegionValue] = useState('ALL');
  const [serviceValue, setServiceValue] = useState('ALL');

  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS);

  const selectedRegions = useMemo((): ApiRegion[] => {
    if (regionValue === 'ALL' || !isApiRegion(regionValue)) {
      return [];
    }
    return [regionValue];
  }, [regionValue]);

  const selectedMoveTypes = useMemo((): ApiMoveType[] => {
    if (serviceValue === 'ALL' || !isApiMoveType(serviceValue)) {
      return [];
    }
    return [serviceValue];
  }, [serviceValue]);

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
  } = useMoversList({
    keyword: debouncedSearch,
    regions: selectedRegions,
    moveTypes: selectedMoveTypes,
    sort: sortValue,
  });

  const { favorites } = useFavoriteMoversPreview(canUseFavorites);

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleResetFilters = () => {
    setRegionValue('ALL');
    setServiceValue('ALL');
  };

  const handleRetry = () => {
    void refetch();
  };

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : (error?.message ?? '기사님 목록을 불러오지 못했습니다.');

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <div
        className={cn(
          'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
          pageXPadding
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          기사님 찾기
        </h1>
      </div>

      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 md:py-8 xl:flex-row xl:items-start xl:gap-8 min-[90rem]:gap-12',
          pageXPadding
        )}
      >
        <MoversSidebar
          className="hidden shrink-0 xl:flex"
          regionValue={regionValue}
          serviceValue={serviceValue}
          onRegionChange={setRegionValue}
          onServiceChange={setServiceValue}
          onResetFilters={handleResetFilters}
          isLoggedIn={isLoggedIn}
          favoriteMovers={favorites}
          onFavoriteClick={handleFavoriteClick}
          isMoverPending={isMoverPending}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-8">
          <MoversToolbar
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            sortValue={sortValue}
            onSortChange={setSortValue}
            regionValue={regionValue}
            serviceValue={serviceValue}
            onRegionChange={setRegionValue}
            onServiceChange={setServiceValue}
          />

          {isPending ? (
            <Spinner message="기사님 목록을 불러오는 중..." />
          ) : null}

          {isError ? (
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
          ) : null}

          {!isPending && !isError && isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-xl-regular text-gray-400">
                조건에 맞는 기사님이 없어요.
              </p>
            </div>
          ) : null}

          {!isError && movers.length > 0 ? (
            <ul className="flex flex-col gap-6 lg:gap-12">
              {movers.map((mover) => (
                <li key={mover.moverId}>
                  <MoverCard
                    mover={mover}
                    size="lg"
                    onFavoriteClick={handleFavoriteClick}
                    isFavoritePending={isMoverPending(mover.moverId)}
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

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeAuthModal} />
      <ProfileRequiredModal
        open={isProfileModalOpen}
        onClose={closeAuthModal}
      />
    </div>
  );
};

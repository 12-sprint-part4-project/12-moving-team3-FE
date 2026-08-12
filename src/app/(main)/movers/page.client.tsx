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

const SEARCH_DEBOUNCE_MS = 300; //0.3초 딜레이

/** 기사님 찾기 목록 페이지 클라이언트 */
export const MoversPageClient = () => {
  const { user } = useAuth(); //유저 정보를 가져오기
  const isLoggedIn = Boolean(user); //로그인 여부 확인 (user가 존재하면 로그인이 된 것. null이 아닌 것.)
  const canUseFavorites = Boolean(user?.isProfileCompleted); //유저 프로필이 완성되어야..찜을 할 수 있다? <- 나중에 소정님이 수정하실수도?
  const {
    //찜 기능 관련 함수들
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

  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS); //0.3초 딜레이 후의 searchValue를 리턴해준다.

  //useMemo: 값이 바뀔 때만, 함수를 다시 실행해서 값을 만드는 훅. (값이 같으면 함수 실행 굳이 안함) (useQuery는 fetch한 데이터를 캐싱하기 위해 사용하는 것!)
  //useMemo를 사용하면, 의존성 배열이 변경되지 않는 한 이전에 계산한 값을 재사용해서 "불필요한 재계산"을 막아줍니다.
  // 즉, 값이 바뀔 때만 함수를 실행하고, 그렇지 않으면 메모리에 저장된 결과를 반환해서 성능을 최적화합니다.
  //여기에서 useMemo를 사용하는 큰 이유는, "참조 안정"을 유지하기 위함. 배열은 값이 같아도 메모리 주소가 바뀐다면 동작이 한 번 더 실행될 수 있는..그런 상황을 방지하기 위해.
  const selectedRegions = useMemo((): ApiRegion[] => {
    if (regionValue === 'ALL' || !isApiRegion(regionValue)) {
      return [];
    }
    return [regionValue]; //값이 1개지만 일관성을 위해 배열로 반환. (훅같은 곳에서 여러지역을 받을 수 있게 되어있다고 함.)
  }, [regionValue]);

  const selectedMoveTypes = useMemo((): ApiMoveType[] => {
    if (serviceValue === 'ALL' || !isApiMoveType(serviceValue)) {
      return [];
    }
    return [serviceValue];
  }, [serviceValue]);

  //기사님 목록을 가져오기. (무한 스크롤로 구현)
  const {
    movers,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage, //queryFn을 실행시켜서 다음 페이지를 가져옴.
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
    rootMargin: '200px', //실제 요소보다 200px 위에서부터 inView가 true가 됨.
  });
  //useInView: 특정 DOM 요소가 화면에 보이는지(뷰포트에 진입했는지) 감지하는 React 훅
  //ref: 관찰할 요소
  //inView: 관찰 요소의 가시성 여부

  //다음 페이지 가져오기 (무한 스크롤)
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  //검색어 설정
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  //필터 초기화
  const handleResetFilters = () => {
    setRegionValue('ALL');
    setServiceValue('ALL');
  };

  //다시 시도 (에러 발생 시 사용함)
  const handleRetry = () => {
    void refetch();
  };

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : (error?.message ?? '기사님 목록을 불러오지 못했습니다.');

  //다양한 화면 크기에서 좌우 패딩(px 단위)이 다르게 적용되도록 설정한 Tailwind CSS 클래스 문자열
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

          <div ref={loadMoreRef} className="w-full">
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

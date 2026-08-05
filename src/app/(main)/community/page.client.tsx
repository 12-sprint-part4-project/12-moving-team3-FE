'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { CommunitySelectDropdown } from './_components/CommunitySelectDropdown';
import { Sort } from '@/components/ui/Sort/Sort';
import {
  BOARD_CATEGORY_FILTER_OPTIONS,
  isBoardCategoryFilter,
  isCommunityRegion,
  isPostSort,
  isRegionFilterValue,
  parseCommunityTabId,
  POST_SORT_OPTIONS,
  REGION_FILTER_OPTIONS,
  type CommunityTabId,
  type RegionFilterValue,
} from '@/constants/communityOptions';
import { usePostList } from '@/hooks/useCommunity';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ApiError } from '@/lib/apiClient';
import {
  COMMUNITY_SEARCH_DEBOUNCE_MS,
  getCommunitySearchKeyword,
} from '@/lib/communitySearch';
import { cn } from '@/lib/utils';
import type { PostCategory, PostSort, Region } from '@/types/community';

import {
  COMMUNITY_DESKTOP_MAIN_GAP,
  COMMUNITY_DESKTOP_X,
  COMMUNITY_HEADER_X,
  COMMUNITY_PAGE_SHELL,
  COMMUNITY_SECTION_X,
} from './_components/communityLayout';
import { CommunityPostList } from './_components/CommunityPostList';
import { CommunitySearchField } from './_components/CommunitySearchField';
import { CommunitySidebarFilter } from './_components/CommunitySidebarFilter';
import { CommunityTabBar } from './_components/CommunityTabBar';

const SORT_CLASS =
  'w-[7.125rem] [&_button]:w-full [&_button]:justify-center [&_button]:shadow-[0.25rem_0.25rem_0.3125rem_0_rgb(220_220_220_/_0.2)]';

/** 커뮤니티 게시글 목록 — Figma Mobile / Tablet / Desktop */
export const CommunityPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseCommunityTabId(searchParams.get('tab'));

  const [categoryFilter, setCategoryFilter] = useState<PostCategory | 'ALL'>(
    'ALL'
  );
  const [regionFilter, setRegionFilter] = useState<RegionFilterValue>('ALL');
  const [sortValue, setSortValue] = useState<PostSort>('LATEST');
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useDebouncedValue(
    searchValue,
    COMMUNITY_SEARCH_DEBOUNCE_MS
  );
  const listKeyword = useMemo(
    () => getCommunitySearchKeyword(debouncedSearch),
    [debouncedSearch]
  );

  const listCategory = useMemo((): PostCategory | undefined => {
    if (activeTab === 'furniture') {
      return 'FURNITURE_SHARE';
    }
    if (categoryFilter === 'ALL') {
      return undefined;
    }
    return categoryFilter;
  }, [activeTab, categoryFilter]);

  const listRegion = useMemo((): Region | undefined => {
    if (regionFilter === 'ALL' || !isCommunityRegion(regionFilter)) {
      return undefined;
    }
    return regionFilter;
  }, [regionFilter]);

  const {
    posts,
    isPending,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isEmpty,
  } = usePostList({
    category: listCategory,
    region: listRegion,
    sort: sortValue,
    keyword: listKeyword,
  });

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleTabChange = useCallback(
    (tabId: CommunityTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tabId === 'board') {
        params.delete('tab');
      } else {
        params.set('tab', tabId);
      }
      const query = params.toString();
      router.replace(query ? `/community?${query}` : '/community');
    },
    [router, searchParams]
  );

  const handleSortChange = (value: string) => {
    if (isPostSort(value)) {
      setSortValue(value);
    }
  };

  const handleCategoryFilterChange = (value: string) => {
    if (isBoardCategoryFilter(value)) {
      setCategoryFilter(value);
    }
  };

  const handleRegionFilterChange = (value: string) => {
    if (isRegionFilterValue(value)) {
      setRegionFilter(value);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleFilterReset = () => {
    setCategoryFilter('ALL');
    setRegionFilter('ALL');
    setSortValue('LATEST');
    setSearchValue('');
  };

  const handleRetry = () => {
    void refetch();
  };

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : (error?.message ?? '게시글 목록을 불러오지 못했습니다.');

  const emptyMessage = listKeyword
    ? '검색 결과가 없습니다.'
    : '등록된 게시글이 없습니다.';

  return (
    <div className={COMMUNITY_PAGE_SHELL}>
      <header
        className={cn(
          'flex h-12 items-center bg-white min-[46.5rem]:h-14 min-[46.5rem]:shadow-page-title',
          'xl:h-[4.5rem] xl:shadow-page-title',
          COMMUNITY_HEADER_X,
          COMMUNITY_DESKTOP_X
        )}
      >
        <h1
          className={cn(
            'text-2lg-bold text-black-400',
            'min-[46.5rem]:text-xl-semibold min-[46.5rem]:text-black-300',
            'xl:text-2xl-semibold xl:text-black-300'
          )}
        >
          커뮤니티
        </h1>
      </header>

      <CommunityTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Mobile / Tablet toolbar */}
      <div
        className={cn(
          'flex h-[3.25rem] items-center gap-2 bg-white xl:hidden',
          'min-[46.5rem]:h-[4.25rem] min-[46.5rem]:gap-2',
          COMMUNITY_SECTION_X
        )}
      >
        {activeTab === 'board' ? (
          <CommunitySelectDropdown
            label="카테고리"
            placeholder="카테고리"
            options={BOARD_CATEGORY_FILTER_OPTIONS}
            value={categoryFilter}
            onValueChange={handleCategoryFilterChange}
            className="w-[6.25rem] shrink-0"
          />
        ) : null}
        <CommunitySelectDropdown
          label="지역"
          placeholder="지역"
          options={REGION_FILTER_OPTIONS}
          value={regionFilter}
          onValueChange={handleRegionFilterChange}
          listColumns={2}
          className="shrink-0"
        />
        <Sort
          options={POST_SORT_OPTIONS}
          value={sortValue}
          onValueChange={handleSortChange}
          size="md"
          className={cn(SORT_CLASS, 'ml-auto')}
        />
      </div>

      <div
        className={cn(
          'bg-white pb-1 xl:hidden min-[46.5rem]:h-16 min-[46.5rem]:py-0.5',
          COMMUNITY_SECTION_X
        )}
      >
        <CommunitySearchField
          value={searchValue}
          onChange={handleSearchChange}
          className="min-[46.5rem]:max-w-[37.5625rem]"
          inputClassName="h-11 max-w-none gap-1.5 rounded-2xl bg-background-200 px-4 py-3.5"
        />
      </div>

      <div
        className={cn(
          'flex bg-white pt-1.5 pb-6 min-[46.5rem]:pt-2 min-[46.5rem]:pb-8',
          'xl:pt-[2.75rem] xl:pb-8',
          COMMUNITY_SECTION_X,
          COMMUNITY_DESKTOP_X,
          COMMUNITY_DESKTOP_MAIN_GAP
        )}
      >
        <CommunitySidebarFilter
          showCategoryFilter={activeTab === 'board'}
          categoryFilter={categoryFilter}
          regionFilter={regionFilter}
          searchValue={searchValue}
          onCategoryChange={handleCategoryFilterChange}
          onRegionChange={handleRegionFilterChange}
          onSearchChange={handleSearchChange}
          onReset={handleFilterReset}
          className="hidden xl:block"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-8 hidden justify-end xl:flex">
            <Sort
              options={POST_SORT_OPTIONS}
              value={sortValue}
              onValueChange={handleSortChange}
              size="md"
              className={SORT_CLASS}
            />
          </div>

          <CommunityPostList
            posts={posts}
            isPending={isPending}
            isError={isError}
            isEmpty={isEmpty}
            isFetchingNextPage={isFetchingNextPage}
            errorMessage={errorMessage}
            emptyMessage={emptyMessage}
            onRetry={handleRetry}
            loadMoreRef={loadMoreRef}
          />
        </div>
      </div>
    </div>
  );
};

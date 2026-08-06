'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { CommunitySelectDropdown } from '../_components/CommunitySelectDropdown';
import { Sort } from '@/components/ui/Sort/Sort';
import {
  BOARD_CATEGORY_FILTER_OPTIONS,
  isBoardCategoryFilter,
  isCommunityRegion,
  isPostSort,
  isRegionFilterValue,
  POST_SORT_OPTIONS,
  REGION_FILTER_OPTIONS,
} from '@/constants/communityOptions';
import { usePostList } from '@/hooks/useCommunity';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ApiError } from '@/lib/apiClient';
import {
  buildPostListContextSearchParams,
  parsePostListContextFromSearchParams,
  type PostListContext,
} from '@/lib/communityListContext';
import {
  COMMUNITY_SEARCH_DEBOUNCE_MS,
  getCommunitySearchKeyword,
} from '@/lib/communitySearch';
import { hasStaleCommunityListPosts } from '@/lib/communityListStalePosts';
import { cn } from '@/lib/utils';
import type { PostCategory, Region } from '@/types/community';

import {
  COMMUNITY_DESKTOP_MAIN_GAP,
  COMMUNITY_DESKTOP_X,
  COMMUNITY_SECTION_X,
} from '../_components/communityLayout';
import { CommunityFilterResetButton } from '../_components/CommunityFilterResetButton';
import { CommunityPostList } from '../_components/CommunityPostList';
import { CommunitySearchField } from '../_components/CommunitySearchField';
import { CommunitySidebarFilter } from '../_components/CommunitySidebarFilter';
import { CommunityWriteButton } from '../_components/CommunityWriteButton';

const SORT_CLASS =
  'w-[8.5rem] [&_button]:h-11 [&_button]:w-full [&_button]:justify-center [&_button]:!shadow-none [&_button]:!text-2lg-medium [&_button]:!leading-normal [&_span]:!text-2lg-medium';

/** Mobile/Tablet — Desktop 대비 2단계 축소 (2lg→md, h-11→h-9) */
const SORT_CLASS_MOBILE =
  'w-[7.25rem] [&_button]:h-9 [&_button]:w-full [&_button]:justify-center [&_button]:!shadow-none [&_button]:!text-md-medium [&_button]:!leading-normal [&_span]:!text-md-medium';

/** 커뮤니티 게시글 목록 — Figma Mobile / Tablet / Desktop */
export const CommunityPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsedContext = useMemo(
    () => parsePostListContextFromSearchParams(searchParams),
    [searchParams]
  );
  const activeTab = parsedContext.tab;
  const categoryFilter = parsedContext.categoryFilter;
  const regionFilter = parsedContext.regionFilter;
  const sortValue = parsedContext.sort;

  const [searchDraft, setSearchDraft] = useState('');
  const [isSearchFlushed, setIsSearchFlushed] = useState(false);

  const replaceListContextUrl = useCallback(
    (context: PostListContext) => {
      const params = buildPostListContextSearchParams(context);
      const qs = params.toString();
      router.replace(qs ? `/community?${qs}` : '/community', { scroll: false });
    },
    [router]
  );

  const searchInputValue =
    parsedContext.keyword !== undefined ? parsedContext.keyword : searchDraft;

  const debouncedSearch = useDebouncedValue(
    searchDraft,
    COMMUNITY_SEARCH_DEBOUNCE_MS
  );
  const listKeyword = useMemo(() => {
    if (parsedContext.keyword !== undefined) {
      return parsedContext.keyword;
    }

    const trimmed = searchDraft.trim();

    if (trimmed.length === 0) {
      return undefined;
    }

    if (isSearchFlushed) {
      return trimmed;
    }

    return getCommunitySearchKeyword(debouncedSearch);
  }, [
    parsedContext.keyword,
    searchDraft,
    isSearchFlushed,
    debouncedSearch,
  ]);

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

  const listContext = useMemo(
    (): PostListContext => ({
      tab: activeTab,
      sort: sortValue,
      categoryFilter,
      regionFilter,
      keyword: listKeyword,
    }),
    [activeTab, sortValue, categoryFilter, regionFilter, listKeyword]
  );

  const {
    posts,
    isPending,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isEmpty,
    isPlaceholderData,
  } = usePostList({
    category: listCategory,
    region: listRegion,
    sort: sortValue,
    keyword: listKeyword,
  });

  const hasStalePosts = useMemo(
    () => hasStaleCommunityListPosts(posts, activeTab, listCategory),
    [posts, activeTab, listCategory]
  );

  const isRefetchingList = isFetching && !isFetchingNextPage;

  const showListSkeleton =
    isPending ||
    isPlaceholderData ||
    (isRefetchingList && hasStalePosts);

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError
    ) {
      void fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  const handleSortChange = (value: string) => {
    if (!isPostSort(value)) {
      return;
    }

    replaceListContextUrl({
      tab: activeTab,
      sort: value,
      categoryFilter,
      regionFilter,
      keyword: listKeyword,
    });
  };

  const handleCategoryFilterChange = (value: string) => {
    if (!isBoardCategoryFilter(value)) {
      return;
    }

    replaceListContextUrl({
      tab: activeTab,
      sort: sortValue,
      categoryFilter: value,
      regionFilter,
      keyword: listKeyword,
    });
  };

  const handleRegionFilterChange = (value: string) => {
    if (!isRegionFilterValue(value)) {
      return;
    }

    replaceListContextUrl({
      tab: activeTab,
      sort: sortValue,
      categoryFilter,
      regionFilter: value,
      keyword: listKeyword,
    });
  };

  const handleSearchChange = (value: string) => {
    setIsSearchFlushed(false);
    setSearchDraft(value);

    if (parsedContext.keyword !== undefined) {
      replaceListContextUrl({
        ...parsedContext,
        keyword: undefined,
      });
    }
  };

  const handleSearch = () => {
    const trimmed = searchDraft.trim();
    setSearchDraft(trimmed);
    setIsSearchFlushed(true);
    replaceListContextUrl({
      ...parsedContext,
      keyword: trimmed.length > 0 ? trimmed : undefined,
    });
  };

  const handleFilterReset = () => {
    setSearchDraft('');
    setIsSearchFlushed(false);
    replaceListContextUrl({
      tab: activeTab,
      sort: 'LATEST',
      categoryFilter: 'ALL',
      regionFilter: 'ALL',
    });
  };

  const handleRetry = () => {
    void refetch();
  };

  const handleRetryNextPage = () => {
    void fetchNextPage();
  };

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : (error?.message ?? '게시글 목록을 불러오지 못했습니다.');

  const emptyMessage = listKeyword
    ? '검색 결과가 없습니다.'
    : activeTab === 'furniture'
      ? '등록된 나눔 글이 없습니다.'
      : '등록된 게시글이 없습니다.';

  return (
    <>
      {/* Mobile / Tablet toolbar */}
      <div
        className={cn(
          'flex h-[3.25rem] items-center gap-2 bg-white xl:hidden',
          'min-[46.5rem]:h-[4.25rem] min-[46.5rem]:gap-2',
          COMMUNITY_SECTION_X
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
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
          <CommunityFilterResetButton onClick={handleFilterReset} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Sort
            options={POST_SORT_OPTIONS}
            value={sortValue}
            onValueChange={handleSortChange}
            size="md"
            className={SORT_CLASS_MOBILE}
          />
          <CommunityWriteButton variant="toolbar" activeTab={activeTab} />
        </div>
      </div>

      <div
        className={cn(
          'bg-white pb-1 xl:hidden min-[46.5rem]:h-16 min-[46.5rem]:py-0.5',
          COMMUNITY_SECTION_X
        )}
      >
        <CommunitySearchField
          value={searchInputValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          className="min-[46.5rem]:max-w-[37.5625rem]"
          inputClassName="h-11 max-w-none gap-1.5 rounded-2xl bg-background-200 px-4 py-3.5"
        />
      </div>

      <div
        className={cn(
          'flex bg-white pt-1.5 pb-24 min-[46.5rem]:pt-2 min-[46.5rem]:pb-8',
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
          searchValue={searchInputValue}
          onCategoryChange={handleCategoryFilterChange}
          onRegionChange={handleRegionFilterChange}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onReset={handleFilterReset}
          className="hidden xl:block"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-8 hidden items-center justify-between xl:flex">
            <Sort
              options={POST_SORT_OPTIONS}
              value={sortValue}
              onValueChange={handleSortChange}
              size="md"
              className={SORT_CLASS}
            />
            <CommunityWriteButton variant="desktop" activeTab={activeTab} />
          </div>

          <CommunityPostList
            posts={posts}
            listContext={listContext}
            variant={activeTab === 'furniture' ? 'furniture-grid' : 'list'}
            showSkeleton={showListSkeleton}
            isError={isError}
            isEmpty={isEmpty}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError}
            errorMessage={errorMessage}
            emptyMessage={emptyMessage}
            onRetry={handleRetry}
            onRetryNextPage={handleRetryNextPage}
            loadMoreRef={loadMoreRef}
          />
        </div>
      </div>

    </>
  );
};

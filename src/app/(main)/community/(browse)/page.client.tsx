'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import SearchIcon from '@/assets/icons/search.svg';
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
import { usePostList } from '@/hooks/usePostList';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ApiError } from '@/lib/apiClient';
import {
  buildCommunityListHref,
  buildPostListContextSearchParams,
  type PostListContext,
} from '@/lib/communityListContext';
import { hasStaleCommunityListPosts } from '@/lib/communityListStalePosts';
import {
  COMMUNITY_SEARCH_DEBOUNCE_MS,
  getCommunitySearchKeyword,
} from '@/lib/communitySearch';
import { cn } from '@/lib/utils';

import { CommunityFilterResetButton, COMMUNITY_FILTER_RESET_BUTTON_CLASS } from '../_components/CommunityFilterResetButton';
import {
  COMMUNITY_DESKTOP_MAIN_GAP,
  COMMUNITY_DESKTOP_X,
  COMMUNITY_SECTION_X,
} from '../_components/communityLayout';
import { CommunityPostList } from '../_components/CommunityPostList';
import { CommunitySearchField } from '../_components/CommunitySearchField';
import { CommunitySelectDropdown } from '../_components/CommunitySelectDropdown';
import { CommunitySidebarFilter } from '../_components/CommunitySidebarFilter';
import { CommunityWriteButton } from '../_components/CommunityWriteButton';

import type { PostCategory, Region } from '@/types/community';

const SORT_CLASS =
  'w-[8.5rem] [&_button]:h-11 [&_button]:w-full [&_button]:justify-center [&_button]:shadow-none! [&_button]:text-2lg-medium! [&_span]:text-2lg-medium!';

/** Mobile/Tablet — Desktop 대비 2단계 축소 (2lg→md, h-11→h-9) */
const SORT_CLASS_MOBILE =
  'w-[7.25rem] [&_button]:h-9 [&_button]:w-full [&_button]:justify-center [&_button]:shadow-none! [&_button]:text-md-medium! [&_span]:text-md-medium!';

interface CommunityPageClientProps {
  initialContext: PostListContext;
}

/** 커뮤니티 게시글 목록 — Figma Mobile / Tablet / Desktop */
export const CommunityPageClient = ({
  initialContext,
}: CommunityPageClientProps) => {
  const router = useRouter();

  const serverHref = buildCommunityListHref(initialContext);
  const [syncedServerHref, setSyncedServerHref] = useState(serverHref);
  const [localContext, setLocalContext] =
    useState<PostListContext>(initialContext);

  if (serverHref !== syncedServerHref) {
    setSyncedServerHref(serverHref);
    setLocalContext(initialContext);
  }

  const activeTab = localContext.tab;
  const categoryFilter = localContext.categoryFilter;
  const regionFilter = localContext.regionFilter;
  const sortValue = localContext.sort;

  const [searchDraft, setSearchDraft] = useState('');
  const [isSearchFlushed, setIsSearchFlushed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(!!initialContext.keyword);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const replaceListContextUrl = useCallback(
    (context: PostListContext) => {
      setLocalContext(context);
      const params = buildPostListContextSearchParams(context);
      const qs = params.toString();
      router.replace(qs ? `/community?${qs}` : '/community', { scroll: false });
    },
    [router]
  );

  const searchInputValue =
    localContext.keyword !== undefined ? localContext.keyword : searchDraft;

  const debouncedSearch = useDebouncedValue(
    searchDraft,
    COMMUNITY_SEARCH_DEBOUNCE_MS
  );
  const listKeyword = useMemo(() => {
    if (localContext.keyword !== undefined) {
      return localContext.keyword;
    }

    const trimmed = searchDraft.trim();

    if (trimmed.length === 0) {
      return undefined;
    }

    if (isSearchFlushed) {
      return trimmed;
    }

    return getCommunitySearchKeyword(debouncedSearch);
  }, [localContext.keyword, searchDraft, isSearchFlushed, debouncedSearch]);

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

  const hideCompleted = localContext.hideCompleted ?? false;

  const listContextValue = useMemo(
    (): PostListContext => ({
      tab: activeTab,
      sort: sortValue,
      categoryFilter,
      regionFilter,
      keyword: listKeyword,
      hideCompleted: hideCompleted || undefined,
    }),
    [
      activeTab,
      sortValue,
      categoryFilter,
      regionFilter,
      listKeyword,
      hideCompleted,
    ]
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
    hideCompleted: hideCompleted || undefined,
  });

  const hasStalePosts = useMemo(
    () => hasStaleCommunityListPosts(posts, activeTab, listCategory),
    [posts, activeTab, listCategory]
  );

  const isRefetchingList = isFetching && !isFetchingNextPage;

  const showListSkeleton =
    isPending || isPlaceholderData || (isRefetchingList && hasStalePosts);

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  // 키워드 있으면 검색창 닫히지 않도록
  useEffect(() => {
    if (listKeyword) setIsSearchOpen(true);
  }, [listKeyword]);

  // 토글로 열릴 때만 포커스 (useState updater 내 사이드이펙트 제거)
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    if (!isSearchOpen || !shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    const timeoutId = window.setTimeout(() => {
      searchWrapperRef.current?.querySelector('input')?.focus();
    }, 200);
    return () => window.clearTimeout(timeoutId);
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    if (!isSearchOpen) shouldFocusRef.current = true;
    setIsSearchOpen((prev) => !prev);
  };

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

    if (localContext.keyword !== undefined) {
      replaceListContextUrl({
        ...localContext,
        keyword: undefined,
      });
    }
  };

  const handleSearch = () => {
    const trimmed = searchDraft.trim();
    setSearchDraft(trimmed);
    setIsSearchFlushed(true);
    replaceListContextUrl({
      ...localContext,
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

  const handleHideCompletedChange = (value: boolean) => {
    replaceListContextUrl({
      ...localContext,
      hideCompleted: value || undefined,
    });
  };

  const handleCategoryOpen = useCallback(() => {
    BOARD_CATEGORY_FILTER_OPTIONS.forEach((option) => {
      router.prefetch(
        buildCommunityListHref({
          ...localContext,
          categoryFilter: option.value,
        })
      );
    });
  }, [router, localContext]);

  const handleRegionOpen = useCallback(() => {
    REGION_FILTER_OPTIONS.forEach((option) => {
      router.prefetch(
        buildCommunityListHref({ ...localContext, regionFilter: option.value })
      );
    });
  }, [router, localContext]);

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
          'flex flex-col bg-white xl:hidden',
          COMMUNITY_SECTION_X
        )}
      >
        {/* 1행: 필터 */}
        <div className="flex h-[3.25rem] items-center gap-2 min-[46.5rem]:h-[4.25rem]">
          {activeTab === 'board' ? (
            <CommunitySelectDropdown
              label="카테고리"
              placeholder="카테고리"
              options={BOARD_CATEGORY_FILTER_OPTIONS}
              value={categoryFilter}
              onValueChange={handleCategoryFilterChange}
              onOpen={handleCategoryOpen}
              className="w-[6.25rem] shrink-0"
            />
          ) : null}
          <CommunitySelectDropdown
            label="지역"
            placeholder="지역"
            options={REGION_FILTER_OPTIONS}
            value={regionFilter}
            onValueChange={handleRegionFilterChange}
            onOpen={handleRegionOpen}
            listColumns={2}
            className="shrink-0"
          />
          <CommunityFilterResetButton onClick={handleFilterReset} />
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="검색"
              aria-expanded={isSearchOpen}
              onClick={handleSearchToggle}
              className={cn(
                COMMUNITY_FILTER_RESET_BUTTON_CLASS,
                isSearchOpen && 'border-blue-300 text-blue-300'
              )}
            >
              <SearchIcon className="size-5 shrink-0" aria-hidden />
            </button>
            <CommunityWriteButton variant="toolbar" activeTab={activeTab} />
          </div>
        </div>
        {/* 2행: 검색창 (토글) */}
        <div
          ref={searchWrapperRef}
          className={cn(
            'grid transition-[grid-template-rows] duration-200',
            isSearchOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="pb-2 pt-1 min-[46.5rem]:pb-3 min-[46.5rem]:pt-1.5">
              <CommunitySearchField
                value={searchInputValue}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                className="min-[46.5rem]:max-w-[37.5625rem]"
                inputClassName="h-11 max-w-none gap-1.5 rounded-2xl bg-background-200 px-4 py-3.5"
              />
            </div>
          </div>
        </div>
        {/* 3행: 정렬 */}
        <div className="flex h-10 items-center justify-end min-[46.5rem]:h-11">
          <Sort
            options={POST_SORT_OPTIONS}
            value={sortValue}
            onValueChange={handleSortChange}
            size="md"
            className={SORT_CLASS_MOBILE}
          />
        </div>
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
          showHideCompleted={activeTab === 'furniture'}
          hideCompleted={hideCompleted}
          categoryFilter={categoryFilter}
          regionFilter={regionFilter}
          searchValue={searchInputValue}
          onCategoryChange={handleCategoryFilterChange}
          onRegionChange={handleRegionFilterChange}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onReset={handleFilterReset}
          onHideCompletedChange={handleHideCompletedChange}
          onCategoryOpen={handleCategoryOpen}
          onRegionOpen={handleRegionOpen}
          writeButton={
            <CommunityWriteButton
              variant="desktop"
              activeTab={activeTab}
              className="h-16 w-full rounded-2xl"
            />
          }
          className="hidden xl:block"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-8 hidden items-center justify-end xl:flex">
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
            listContext={listContextValue}
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

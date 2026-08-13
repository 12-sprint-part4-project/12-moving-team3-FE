import {
  isBoardCategoryFilter,
  isPostSort,
  isRegionFilterValue,
  parseCommunityTabId,
  type CommunityTabId,
  type RegionFilterValue,
} from '@/constants/communityOptions';
import type { PostCategory, PostListParams, PostSort } from '@/types/community';

/** 게시글 카테고리 → 목록 탭 */
export const getTabFromPostCategory = (
  category: PostCategory
): CommunityTabId => (category === 'FURNITURE_SHARE' ? 'furniture' : 'board');

/** 목록 필터 컨텍스트 — 상세 이전/다음글 API·URL 공유용 */
export interface PostListContext {
  tab: CommunityTabId;
  sort: PostSort;
  categoryFilter: PostCategory | 'ALL';
  regionFilter: RegionFilterValue;
  keyword?: string;
  hideCompleted?: boolean;
}

export const DEFAULT_POST_LIST_CONTEXT: PostListContext = {
  tab: 'board',
  sort: 'LATEST',
  categoryFilter: 'ALL',
  regionFilter: 'ALL',
};

/** BE neighbors API 쿼리와 동일한 목록 파라미터 */
export const postListContextToParams = (
  context: PostListContext
): PostListParams => {
  const category =
    context.tab === 'furniture'
      ? 'FURNITURE_SHARE'
      : context.categoryFilter === 'ALL'
        ? undefined
        : context.categoryFilter;

  const region =
    context.regionFilter === 'ALL' ? undefined : context.regionFilter;

  return {
    category,
    region,
    sort: context.sort,
    keyword: context.keyword,
    hideCompleted: context.hideCompleted,
  };
};

export const buildPostListContextSearchParams = (
  context: PostListContext
): URLSearchParams => {
  const params = new URLSearchParams();

  if (context.tab === 'furniture') {
    params.set('tab', 'furniture');
  }

  if (context.sort !== 'LATEST') {
    params.set('sort', context.sort);
  }

  if (context.tab === 'board' && context.categoryFilter !== 'ALL') {
    params.set('category', context.categoryFilter);
  }

  if (context.regionFilter !== 'ALL') {
    params.set('region', context.regionFilter);
  }

  if (context.keyword) {
    params.set('keyword', context.keyword);
  }

  if (context.hideCompleted) {
    params.set('hideCompleted', 'true');
  }

  return params;
};

export const buildCommunityListHref = (
  context: PostListContext
): string => {
  const qs = buildPostListContextSearchParams(context).toString();
  return qs ? `/community?${qs}` : '/community';
};

export const buildCommunityPostDetailHref = (
  postId: number,
  context: PostListContext = DEFAULT_POST_LIST_CONTEXT
): string => {
  const qs = buildPostListContextSearchParams(context).toString();
  return qs ? `/community/${postId}?${qs}` : `/community/${postId}`;
};

/** 글쓰기 진입 URL — 가구나눔 탭에서는 카테고리 사전 선택 */
export const buildCommunityWriteHref = (
  tab: CommunityTabId = 'board'
): string =>
  tab === 'furniture' ? '/community/write?tab=furniture' : '/community/write';

export const parsePostListContextFromSearchParams = (
  searchParams: Pick<URLSearchParams, 'get'>
): PostListContext => {
  const tab = parseCommunityTabId(searchParams.get('tab'));

  const sortParam = searchParams.get('sort');
  const sort =
    sortParam && isPostSort(sortParam)
      ? sortParam
      : DEFAULT_POST_LIST_CONTEXT.sort;

  const categoryParam = searchParams.get('category');
  const categoryFilter =
    tab === 'board' &&
    categoryParam &&
    isBoardCategoryFilter(categoryParam) &&
    categoryParam !== 'ALL'
      ? categoryParam
      : DEFAULT_POST_LIST_CONTEXT.categoryFilter;

  const regionParam = searchParams.get('region');
  const regionFilter =
    regionParam && isRegionFilterValue(regionParam)
      ? regionParam
      : DEFAULT_POST_LIST_CONTEXT.regionFilter;

  const keywordParam = searchParams.get('keyword')?.trim();
  const keyword =
    keywordParam && keywordParam.length > 0 ? keywordParam : undefined;

  const hideCompleted =
    tab === 'furniture' && searchParams.get('hideCompleted') === 'true'
      ? true
      : undefined;

  return {
    tab,
    sort,
    categoryFilter,
    regionFilter,
    keyword,
    hideCompleted,
  };
};

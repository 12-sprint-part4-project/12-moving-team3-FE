import { REGION_CHIP_OPTIONS } from '@/constants/commonOptions';

import type { PostCategory, PostSort, Region } from '@/types/community';

export type RegionFilterValue = Region | 'ALL';

export type CommunityTabId = 'board' | 'furniture';

export const COMMUNITY_TABS: { id: CommunityTabId; label: string }[] = [
  { id: 'board', label: '게시판' },
  { id: 'furniture', label: '가구나눔' },
];

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  MOVING_TIP: '이사팁',
  QUESTION: '질문',
  REVIEW: '후기',
  ETC: '기타',
  FURNITURE_SHARE: '가구나눔',
};

const BOARD_CATEGORY_VALUES = [
  'MOVING_TIP',
  'QUESTION',
  'REVIEW',
  'ETC',
] as const satisfies readonly PostCategory[];

export const BOARD_CATEGORY_FILTER_OPTIONS: {
  label: string;
  value: PostCategory | 'ALL';
}[] = [
  { label: '전체', value: 'ALL' },
  ...BOARD_CATEGORY_VALUES.map((value) => ({
    label: POST_CATEGORY_LABEL[value],
    value,
  })),
];

/** 게시글 작성 — 게시판 탭 카테고리 (전체 제외) */
export const BOARD_WRITE_CATEGORY_OPTIONS = BOARD_CATEGORY_VALUES.map(
  (value) => ({
    label: POST_CATEGORY_LABEL[value],
    value,
  })
);

export const FURNITURE_WRITE_CATEGORY = 'FURNITURE_SHARE' as const;

/** 게시글 작성 — 전체 카테고리 (탭 분기 없음) */
export const WRITE_CATEGORY_OPTIONS: {
  label: string;
  value: PostCategory;
}[] = [
  ...BOARD_WRITE_CATEGORY_OPTIONS,
  {
    label: POST_CATEGORY_LABEL.FURNITURE_SHARE,
    value: FURNITURE_WRITE_CATEGORY,
  },
];

/** 게시글 작성 — 가구나눔 지역 선택 (전체 제외) */
export const WRITE_REGION_OPTIONS: { label: string; value: Region }[] =
  REGION_CHIP_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

export const REGION_LABEL: Record<Region, string> = Object.fromEntries(
  REGION_CHIP_OPTIONS.map((option) => [option.value, option.label])
) as Record<Region, string>;

export const DEFAULT_WRITE_CATEGORY: PostCategory = 'MOVING_TIP';

export const isPostCategory = (value: string): value is PostCategory =>
  WRITE_CATEGORY_OPTIONS.some((option) => option.value === value);

/** 작성 페이지 URL category 쿼리 → 초기 카테고리 */
export const getInitialWriteCategory = (
  searchParams: Pick<URLSearchParams, 'get'>
): PostCategory => {
  const tab = parseCommunityTabId(searchParams.get('tab'));

  if (tab === 'furniture') {
    return FURNITURE_WRITE_CATEGORY;
  }

  const category = searchParams.get('category');

  if (category && isPostCategory(category)) {
    return category;
  }

  return DEFAULT_WRITE_CATEGORY;
};

/** 게시글 이미지 최대 첨부 수 — 작성·상세 공통 */
export const MAX_POST_IMAGE_COUNT = 5;

/** 게시글 제목 최대 길이 — 목록 한 줄 UX (BE max 100) */
export const MAX_POST_TITLE_LENGTH = 30;

/** 커뮤니티 지역 필터 — commonOptions 칩 + 전체 */
export const REGION_FILTER_OPTIONS: {
  label: string;
  value: RegionFilterValue;
}[] = [
  { label: '전체', value: 'ALL' },
  ...REGION_CHIP_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  })),
];

export const isRegionFilterValue = (
  value: string
): value is RegionFilterValue =>
  value === 'ALL' ||
  REGION_CHIP_OPTIONS.some((option) => option.value === value);

export const isCommunityRegion = (value: string): value is Region =>
  REGION_CHIP_OPTIONS.some((option) => option.value === value);

export const POST_SORT_OPTIONS: { label: string; value: PostSort }[] = [
  { label: '최신순', value: 'LATEST' },
  { label: '인기순', value: 'POPULAR' },
  { label: '댓글순', value: 'MOST_COMMENTED' },
];

export const isFurnitureSharePost = (
  category: PostCategory
): category is 'FURNITURE_SHARE' => category === 'FURNITURE_SHARE';

export const isCommunityTabId = (value: string): value is CommunityTabId =>
  value === 'board' || value === 'furniture';

export const parseCommunityTabId = (value: string | null): CommunityTabId =>
  value && isCommunityTabId(value) ? value : 'board';

export const isPostSort = (value: string): value is PostSort =>
  value === 'LATEST' || value === 'POPULAR' || value === 'MOST_COMMENTED';

export const isBoardCategoryFilter = (
  value: string
): value is PostCategory | 'ALL' =>
  BOARD_CATEGORY_FILTER_OPTIONS.some((option) => option.value === value);

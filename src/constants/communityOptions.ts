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

export const BOARD_CATEGORY_FILTER_OPTIONS: {
  label: string;
  value: PostCategory | 'ALL';
}[] = [
  { label: '전체', value: 'ALL' },
  { label: '이사팁', value: 'MOVING_TIP' },
  { label: '질문', value: 'QUESTION' },
  { label: '후기', value: 'REVIEW' },
  { label: '기타', value: 'ETC' },
];

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

export const isCommunityTabId = (value: string): value is CommunityTabId =>
  value === 'board' || value === 'furniture';

export const isPostSort = (value: string): value is PostSort =>
  value === 'LATEST' || value === 'POPULAR' || value === 'MOST_COMMENTED';

export const isBoardCategoryFilter = (
  value: string
): value is PostCategory | 'ALL' =>
  value === 'ALL' ||
  value === 'MOVING_TIP' ||
  value === 'QUESTION' ||
  value === 'REVIEW' ||
  value === 'ETC';

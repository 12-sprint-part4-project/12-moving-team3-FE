import type { ApiSuccessResponse } from '@/types/api';
import type { ApiMoveType } from '@/types/estimateRequest';

export type { ApiMoveType };

/** BE Region enum (prisma) */
export type ApiRegion =
  | 'SEOUL'
  | 'GYEONGGI'
  | 'INCHEON'
  | 'GANGWON'
  | 'CHUNGBUK'
  | 'CHUNGNAM'
  | 'SEJONG'
  | 'DAEJEON'
  | 'JEONBUK'
  | 'GWANGJU_JEONNAM'
  | 'GYEONGBUK'
  | 'DAEGU'
  | 'ULSAN'
  | 'GYEONGNAM'
  | 'BUSAN'
  | 'JEJU';

/**
 * FE 정렬 ↔ BE 쿼리
 * - reviewCountDesc    → sort=reviewCount
 * - ratingDesc         → sort=averageRating
 * - careerDesc         → sort=career
 * - confirmedCountDesc → sort=confirmedCount
 * (정렬 방향은 모두 내림차순 고정)
 */
export type MoverSortField =
  | 'reviewCount'
  | 'averageRating'
  | 'career'
  | 'confirmedCount';

/** UI 정렬 값 → API sort */
export type MoversSortValue =
  | 'reviewCountDesc'
  | 'ratingDesc'
  | 'careerDesc'
  | 'confirmedCountDesc';

/** GET /api/movers 쿼리 파라미터 */
export interface MoversListParams {
  keyword?: string;
  regions?: ApiRegion[];
  moveTypes?: ApiMoveType[];
  sort?: MoverSortField;
  cursor?: string;
  limit?: number;
}

/** GET /api/movers/favorites 쿼리 */
export interface FavoriteMoversParams {
  cursor?: string;
  limit?: number;
}

export interface ReviewRatingCounts {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewStats {
  ratingCounts: ReviewRatingCounts;
  totalCount: number;
  averageRating: number | null;
}

export interface MoverListUser {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface MoverServiceRegion {
  id: number;
  region: ApiRegion;
}

/** GET /api/movers items[] */
export interface MoverListItem {
  id: number;
  userId: string;
  service: ApiMoveType[];
  career: number | null;
  description: string | null;
  shortDescription: string | null;
  createdAt: string;
  updatedAt: string;
  user: MoverListUser;
  serviceRegions: MoverServiceRegion[];
  review: ReviewStats;
  isFavorited: boolean;
  /** BE 확장 예정 — 없으면 FE에서 0으로 표시 */
  favoritedCount?: number;
  confirmedCount?: number;
}

export interface MoversListMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export type MoversListResponse = ApiSuccessResponse<
  { items: MoverListItem[] },
  MoversListMeta
> & {
  meta: MoversListMeta;
};

export interface MoverDetailUser extends MoverListUser {
  name: string;
}

/** GET /api/movers/:id → data.moverDetail */
export interface MoverDetail {
  id: number;
  userId: string;
  service: ApiMoveType[];
  career: number | null;
  description: string | null;
  shortDescription: string | null;
  createdAt: string;
  updatedAt: string;
  user: MoverDetailUser;
  serviceRegions: MoverServiceRegion[];
}

export interface MoverDetailData {
  moverDetail: MoverDetail;
  reviewStats: ReviewStats;
  isFavorited: boolean;
  /** BE 확장 예정 — 없으면 FE에서 null(미표시) */
  favoritedCount?: number;
  confirmedCount?: number;
}

export type MoverDetailResponse = ApiSuccessResponse<MoverDetailData>;

/** 찜 목록 아이템 (Favorite + mover + stats) */
export interface FavoriteMoverListItem {
  id: number;
  userId: string;
  moverId: string | null;
  createdAt: string;
  mover: {
    id: string;
    name: string;
    profileImageUrl: string | null;
    moverProfile: {
      career: number | null;
      serviceRegions: MoverServiceRegion[];
      /** BE 확장 예정 — 서비스 유형 */
      service?: ApiMoveType[];
    } | null;
  } | null;
  reviewStats: ReviewStats;
  favoritedCount: number;
  /** BE 확장 예정 — 없으면 FE에서 0 / 빈 배열로 표시 */
  service?: ApiMoveType[];
  confirmedCount?: number;
}

export type FavoriteMoversResponse = ApiSuccessResponse<
  { items: FavoriteMoverListItem[] },
  MoversListMeta
> & {
  meta: MoversListMeta;
};

/** 카드·상세 공통 UI 모델 */
export interface MoverCardModel {
  moverId: string;
  nickname: string;
  profileImageUrl: string | null;
  services: ApiMoveType[];
  regions: ApiRegion[];
  career: number | null;
  shortDescription: string | null;
  description: string | null;
  averageRating: number | null;
  reviewCount: number;
  ratingCounts: ReviewRatingCounts;
  isFavorited: boolean;
  /** null이면 카운트 미제공(상세 등) — UI에서 숨김/`-` */
  favoritedCount: number | null;
  confirmedCount: number | null;
  isDesignated?: boolean;
}

export const ALL_API_MOVE_TYPES: ApiMoveType[] = ['SMALL', 'HOME', 'OFFICE'];

export const ALL_API_REGIONS: ApiRegion[] = [
  'SEOUL',
  'GYEONGGI',
  'INCHEON',
  'GANGWON',
  'CHUNGBUK',
  'CHUNGNAM',
  'SEJONG',
  'DAEJEON',
  'JEONBUK',
  'GWANGJU_JEONNAM',
  'GYEONGBUK',
  'DAEGU',
  'ULSAN',
  'GYEONGNAM',
  'BUSAN',
  'JEJU',
];

export const REGION_LABELS: Record<ApiRegion, string> = {
  SEOUL: '서울',
  GYEONGGI: '경기',
  INCHEON: '인천',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  SEJONG: '세종',
  DAEJEON: '대전',
  JEONBUK: '전북',
  GWANGJU_JEONNAM: '광주·전남',
  GYEONGBUK: '경북',
  DAEGU: '대구',
  ULSAN: '울산',
  GYEONGNAM: '경남',
  BUSAN: '부산',
  JEJU: '제주',
};

export const MOVE_TYPE_LABELS: Record<ApiMoveType, string> = {
  SMALL: '소형이사',
  HOME: '가정이사',
  OFFICE: '사무실이사',
};

export const REGION_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: '전체', value: 'ALL' },
  ...ALL_API_REGIONS.map((region) => ({
    label: REGION_LABELS[region],
    value: region,
  })),
];

export const SERVICE_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: '전체', value: 'ALL' },
  ...ALL_API_MOVE_TYPES.map((moveType) => ({
    label: MOVE_TYPE_LABELS[moveType],
    value: moveType,
  })),
];

/**
 * FE 정렬 ↔ BE 쿼리
 * - reviewCountDesc    → sort=reviewCount
 * - ratingDesc         → sort=averageRating
 * - careerDesc         → sort=career
 * - confirmedCountDesc → sort=confirmedCount
 */
export const SORT_VALUE_TO_API: Record<MoversSortValue, MoverSortField> = {
  reviewCountDesc: 'reviewCount',
  ratingDesc: 'averageRating',
  careerDesc: 'career',
  confirmedCountDesc: 'confirmedCount',
};

export const MOVERS_SORT_OPTIONS: { label: string; value: MoversSortValue }[] =
  [
    { label: '리뷰 많은순', value: 'reviewCountDesc' },
    { label: '평점 높은순', value: 'ratingDesc' },
    { label: '경력 많은순', value: 'careerDesc' },
    { label: '확정 많은순', value: 'confirmedCountDesc' },
  ];

export const isMoversSortValue = (value: string): value is MoversSortValue =>
  value === 'reviewCountDesc' ||
  value === 'ratingDesc' ||
  value === 'careerDesc' ||
  value === 'confirmedCountDesc';

export const isApiMoveType = (value: string): value is ApiMoveType =>
  value === 'SMALL' || value === 'HOME' || value === 'OFFICE';

export const isApiRegion = (value: string): value is ApiRegion =>
  (ALL_API_REGIONS as string[]).includes(value);

/** UUID v4 형태 여부 (상세 path 가드) */
export const isMoverId = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

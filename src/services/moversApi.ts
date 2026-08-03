import { API_BASE_URL } from '@/services/apiClient.legacy';
import { fetchAndValidate } from '@/services/moverApiResponse';
import { assertMoverAccessToken } from '@/services/moversAuth';
import type {
  FavoriteMoverListItem,
  FavoriteMoversParams,
  FavoriteMoversResponse,
  MoverCardModel,
  MoverDetailData,
  MoverDetailResponse,
  MoverListItem,
  MoversListParams,
  MoversListResponse,
  ReviewStats,
} from '@/types/mover';

/**
 * 기사님 목록 쿼리스트링 생성.
 * - region / moveType: 부분 선택만 전달. 미선택·전체 선택 시 생략 → BE 전체 조회
 * - sort / order: 기본 reviewCount + desc (FE 정렬 제안 참고: types/mover.ts)
 */
export const buildMoversListQuery = (params: MoversListParams): string => {
  const searchParams = new URLSearchParams();
  const regions = params.regions ?? [];
  const moveTypes = params.moveTypes ?? [];
  const sort = params.sort ?? 'reviewCount';
  const order = params.order ?? 'desc';

  if (params.keyword?.trim()) {
    searchParams.set('keyword', params.keyword.trim());
  }

  if (regions.length > 0) {
    searchParams.set('region', regions.join(','));
  }

  if (moveTypes.length > 0) {
    searchParams.set('moveType', moveTypes.join(','));
  }

  searchParams.set('sort', sort);
  searchParams.set('order', order);

  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const isReviewStats = (value: unknown): value is ReviewStats => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const stats = value as ReviewStats;
  return (
    typeof stats.totalCount === 'number' &&
    (typeof stats.averageRating === 'number' || stats.averageRating === null) &&
    !!stats.ratingCounts &&
    typeof stats.ratingCounts === 'object'
  );
};

/** 목록 성공 응답 구조 검증 */
const isMoversListResponse = (body: unknown): body is MoversListResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data, meta } = body as {
    data?: unknown;
    meta?: unknown;
  };

  if (!data || typeof data !== 'object') {
    return false;
  }

  if (!Array.isArray((data as { items?: unknown }).items)) {
    return false;
  }

  if (!meta || typeof meta !== 'object') {
    return false;
  }

  const listMeta = meta as {
    nextCursor?: unknown;
    hasNextPage?: unknown;
  };

  return (
    (typeof listMeta.nextCursor === 'string' || listMeta.nextCursor === null) &&
    typeof listMeta.hasNextPage === 'boolean'
  );
};

/** 상세 성공 응답 구조 검증 */
const isMoverDetailResponse = (
  body: unknown
): body is MoverDetailResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data } = body as { data?: unknown };
  if (!data || typeof data !== 'object') {
    return false;
  }

  const detailData = data as {
    moverDetail?: unknown;
    reviewStats?: unknown;
    isFavorited?: unknown;
  };

  return (
    !!detailData.moverDetail &&
    typeof detailData.moverDetail === 'object' &&
    isReviewStats(detailData.reviewStats) &&
    typeof detailData.isFavorited === 'boolean'
  );
};

const EMPTY_RATING_COUNTS = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as const;

const toCardModel = ({
  moverId,
  nickname,
  profileImageUrl,
  services,
  regions,
  career,
  shortDescription,
  description,
  review,
  isFavorited,
  favoritedCount,
  confirmedCount,
  isDesignated,
}: {
  moverId: string;
  nickname: string;
  profileImageUrl: string | null;
  services: MoverListItem['service'];
  regions: MoverServiceRegionLike[];
  career: number | null;
  shortDescription: string | null;
  description: string | null;
  review: ReviewStats;
  isFavorited: boolean;
  favoritedCount?: number | null;
  confirmedCount?: number | null;
  isDesignated?: boolean;
}): MoverCardModel => ({
  moverId,
  nickname,
  profileImageUrl,
  services,
  regions: regions.map((region) => region.region),
  career,
  shortDescription,
  description,
  averageRating: review.averageRating,
  reviewCount: review.totalCount,
  ratingCounts: review.ratingCounts ?? EMPTY_RATING_COUNTS,
  isFavorited,
  favoritedCount: favoritedCount ?? null,
  confirmedCount: confirmedCount ?? null,
  isDesignated,
});

type MoverServiceRegionLike = { region: MoverListItem['serviceRegions'][number]['region'] };

/** 목록 아이템 → 카드 UI 모델 */
export const toMoverCardModelFromListItem = (
  item: MoverListItem
): MoverCardModel =>
  toCardModel({
    moverId: item.user.id,
    nickname: item.user.nickname,
    profileImageUrl: item.user.profileImageUrl,
    services: item.service,
    regions: item.serviceRegions,
    career: item.career,
    shortDescription: item.shortDescription,
    description: item.description,
    review: item.review,
    isFavorited: item.isFavorited,
    favoritedCount: item.favoritedCount ?? 0,
    confirmedCount: item.confirmedCount ?? 0,
  });

/** 상세 응답 → 카드/상세 UI 모델 */
export const toMoverCardModelFromDetail = (
  data: MoverDetailData
): MoverCardModel =>
  toCardModel({
    moverId: data.moverDetail.user.id,
    nickname: data.moverDetail.user.nickname,
    profileImageUrl: data.moverDetail.user.profileImageUrl,
    services: data.moverDetail.service,
    regions: data.moverDetail.serviceRegions,
    career: data.moverDetail.career,
    shortDescription: data.moverDetail.shortDescription,
    description: data.moverDetail.description,
    review: data.reviewStats,
    isFavorited: data.isFavorited,
    favoritedCount: data.favoritedCount ?? null,
    confirmedCount: data.confirmedCount ?? null,
  });

/** 찜 목록 아이템 → 카드 UI 모델 */
export const toMoverCardModelFromFavorite = (
  item: FavoriteMoverListItem
): MoverCardModel | null => {
  if (!item.moverId || !item.mover) {
    return null;
  }

  const services =
    item.service ?? item.mover.moverProfile?.service ?? [];

  return toCardModel({
    moverId: item.moverId,
    nickname: item.mover.name,
    profileImageUrl: item.mover.profileImageUrl,
    services,
    regions: item.mover.moverProfile?.serviceRegions ?? [],
    career: item.mover.moverProfile?.career ?? null,
    shortDescription: null,
    description: null,
    review: item.reviewStats,
    isFavorited: true,
    favoritedCount: item.favoritedCount,
    confirmedCount: item.confirmedCount ?? null,
  });
};

/**
 * 기사님 목록 조회.
 * GET /api/movers
 * authFetch: 세션 토큰이 있으면 부착, 401 시 refresh 1회 후 재시도.
 */
export const getMovers = async (
  params: MoversListParams = {}
): Promise<MoversListResponse> => {
  const query = buildMoversListQuery(params);

  return fetchAndValidate(
    `${API_BASE_URL}/api/movers${query}`,
    { method: 'GET' },
    isMoversListResponse,
    '요청 처리 중 오류가 발생했습니다.'
  );
};

/**
 * 기사님 상세 조회.
 * GET /api/movers/:id (User UUID)
 * authFetch: 세션 토큰이 있으면 부착, 401 시 refresh 1회 후 재시도.
 */
export const getMoverDetail = async (
  moverId: string
): Promise<MoverDetailResponse> => {
  return fetchAndValidate(
    `${API_BASE_URL}/api/movers/${moverId}`,
    { method: 'GET' },
    isMoverDetailResponse,
    '요청 처리 중 오류가 발생했습니다.'
  );
};

const isFavoriteMoversResponse = (
  body: unknown
): body is FavoriteMoversResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data, meta } = body as {
    data?: unknown;
    meta?: unknown;
  };

  if (!data || typeof data !== 'object') {
    return false;
  }

  if (!Array.isArray((data as { items?: unknown }).items)) {
    return false;
  }

  if (!meta || typeof meta !== 'object') {
    return false;
  }

  const listMeta = meta as {
    nextCursor?: unknown;
    hasNextPage?: unknown;
  };

  return (
    (typeof listMeta.nextCursor === 'string' || listMeta.nextCursor === null) &&
    typeof listMeta.hasNextPage === 'boolean'
  );
};

/**
 * 찜한 기사님 목록 조회 (CUSTOMER).
 * GET /api/movers/favorites
 * authFetch: 401 시 refresh 1회 후 재시도.
 */
export const getFavoriteMovers = async (
  params: FavoriteMoversParams = {}
): Promise<FavoriteMoversResponse> => {
  assertMoverAccessToken();

  const searchParams = new URLSearchParams();
  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';

  return fetchAndValidate(
    `${API_BASE_URL}/api/movers/favorites${suffix}`,
    { method: 'GET' },
    isFavoriteMoversResponse,
    '요청 처리 중 오류가 발생했습니다.'
  );
};

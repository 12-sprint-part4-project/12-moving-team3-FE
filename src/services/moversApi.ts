import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  getAccessToken,
} from '@/services/apiClient';
import type { ApiErrorBody } from '@/types/api';
import type {
  MoverCardModel,
  MoverDetailData,
  MoverDetailResponse,
  MoverListItem,
  MoversListParams,
  MoversListResponse,
  ReviewStats,
} from '@/types/mover';

const getOptionalAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * 기사님 목록 쿼리스트링 생성.
 * - region / moveType: 부분 선택만 전달. 미선택·전체 선택 시 생략 → BE 전체 조회
 * - sort / order: 기본 createdAt + desc
 */
export const buildMoversListQuery = (params: MoversListParams): string => {
  const searchParams = new URLSearchParams();
  const regions = params.regions ?? [];
  const moveTypes = params.moveTypes ?? [];
  const sort = params.sort ?? 'createdAt';
  const order =
    params.order ?? (sort === 'career' ? 'asc' : 'desc');

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
}: {
  moverId: string;
  nickname: string;
  profileImageUrl: string | null;
  services: MoverListItem['service'];
  regions: MoverListItem['serviceRegions'];
  career: number | null;
  shortDescription: string | null;
  description: string | null;
  review: ReviewStats;
  isFavorited: boolean;
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
});

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
  });

/**
 * 기사님 목록 조회.
 * GET /api/movers
 */
export const getMovers = async (
  params: MoversListParams = {}
): Promise<MoversListResponse> => {
  const query = buildMoversListQuery(params);

  const response = await fetch(`${API_BASE_URL}/api/movers${query}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: getOptionalAuthHeaders(),
    signal: createApiTimeoutSignal(),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody =
      body && typeof body === 'object' ? (body as ApiErrorBody) : null;
    throw new ApiError(
      response.status,
      errorBody?.error?.code ?? 'UNKNOWN_ERROR',
      errorBody?.error?.message ?? '요청 처리 중 오류가 발생했습니다.'
    );
  }

  if (!isMoversListResponse(body)) {
    throw new ApiError(
      response.status,
      'INVALID_RESPONSE',
      '요청 처리 중 오류가 발생했습니다.'
    );
  }

  return body;
};

/**
 * 기사님 상세 조회.
 * GET /api/movers/:id (User UUID)
 */
export const getMoverDetail = async (
  moverId: string
): Promise<MoverDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/movers/${moverId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: getOptionalAuthHeaders(),
    signal: createApiTimeoutSignal(),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody =
      body && typeof body === 'object' ? (body as ApiErrorBody) : null;
    throw new ApiError(
      response.status,
      errorBody?.error?.code ?? 'UNKNOWN_ERROR',
      errorBody?.error?.message ?? '요청 처리 중 오류가 발생했습니다.'
    );
  }

  if (!isMoverDetailResponse(body)) {
    throw new ApiError(
      response.status,
      'INVALID_RESPONSE',
      '요청 처리 중 오류가 발생했습니다.'
    );
  }

  return body;
};

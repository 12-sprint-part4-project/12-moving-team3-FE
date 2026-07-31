import { formatMoveDateLabel, formatRelativeTime } from '@/lib/formatDate';
import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  getAccessToken,
} from '@/services/apiClient';
import type { ApiErrorBody } from '@/types/api';
import type {
  EstimateRequestListItem,
  EstimateRequestListResponse,
  MoveTypeFilterCounts,
  ReceivedEstimateRequestsParams,
  ReceivedRequestCardModel,
  RequestScopeFilterCounts,
  RequestsSortValue,
} from '@/types/estimateRequest';
import {
  ALL_MOVE_TYPES,
  API_MOVE_TYPE_TO_UI,
  MOVE_TYPE_TO_API,
  SORT_VALUE_TO_API,
} from '@/types/estimateRequest';

/** 주소 앞 2토큰으로 시·군·구 라벨 생성 (예: 서울 강남구) */
export const formatDistrictLabel = (
  address: string | null | undefined
): string | null => {
  if (!address) {
    return null;
  }

  const tokens = address.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return null;
  }
  if (tokens.length === 1) {
    return tokens[0];
  }

  return `${tokens[0]} ${tokens[1]}`;
};

/** 주소·지역 라벨 표시 문자열 선택 */
export const formatLocationLabel = (location: {
  address: string | null;
  regionLabel: string | null;
}): string =>
  formatDistrictLabel(location.address) ?? location.regionLabel ?? '-';

/** BE 아이템 → 카드 UI 모델 변환 */
export const toReceivedRequestCardModel = (
  item: EstimateRequestListItem
): ReceivedRequestCardModel => ({
  id: item.id,
  customerName: item.customer.name,
  moveType: item.moveType ? API_MOVE_TYPE_TO_UI[item.moveType] : null,
  isDesignated: item.isDesignated,
  requestedAgo: item.submittedAt ? formatRelativeTime(item.submittedAt) : '',
  moveDate: formatMoveDateLabel(item.moveDate),
  departure: formatLocationLabel(item.departure),
  arrival: formatLocationLabel(item.arrival),
});

/** UI 필터 건수 변환 */
export const toMoveTypeFilterCounts = (counts: {
  SMALL: number;
  HOME: number;
  OFFICE: number;
}): MoveTypeFilterCounts => ({
  small: counts.SMALL,
  home: counts.HOME,
  office: counts.OFFICE,
});

/** UI 범위 필터 건수 변환 */
export const toScopeFilterCounts = (counts: {
  serviceAreaOnly: number;
  designated: number;
}): RequestScopeFilterCounts => ({
  serviceArea: counts.serviceAreaOnly,
  designated: counts.designated,
});

/**
 * 받은 요청 목록 조회 쿼리스트링 생성.
 * - 이사 유형: 전체 선택·미선택 시 moveType 생략. 부분 선택만 전달.
 *   (미선택 시 목록 0건은 훅에서 처리. API는 필터 건수 집계용으로 유형 전체 조회)
 * - 범위:
 *   - 미선택(둘 다 생략) → BE 기본: 아직 안 보낸·유효한 견적 요청 전부
 *   - 전체 선택(둘 다 true) → 지정 ∪ 서비스지역 OR
 *   - 부분 선택 → 해당 플래그만 전달
 */
export const buildReceivedEstimateRequestsQuery = (
  params: ReceivedEstimateRequestsParams
): string => {
  const searchParams = new URLSearchParams();
  const sort: RequestsSortValue = params.sort ?? 'moveDateAsc';
  const moveTypes = params.moveTypes ?? [];
  const scopes = params.scopes ?? [];

  if (params.keyword?.trim()) {
    searchParams.set('keyword', params.keyword.trim());
  }

  // 이사 유형 부분 선택 시에만 moveType 전달
  if (moveTypes.length > 0 && moveTypes.length < ALL_MOVE_TYPES.length) {
    searchParams.set(
      'moveType',
      moveTypes.map((type) => MOVE_TYPE_TO_API[type]).join(',')
    );
  }

  // 범위: 선택된 플래그만 전달. 미선택이면 생략 → BE 기본 전체 목록
  const hasServiceArea = scopes.includes('serviceArea');
  const hasDesignated = scopes.includes('designated');
  if (hasServiceArea) {
    searchParams.set('serviceArea', 'true');
  }
  if (hasDesignated) {
    searchParams.set('designated', 'true');
  }

  searchParams.set('sort', SORT_VALUE_TO_API[sort]);

  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

/** 목록 성공 응답의 필수 구조 검증 */
const isEstimateRequestListResponse = (
  body: unknown
): body is EstimateRequestListResponse => {
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
    totalCount?: unknown;
    nextCursor?: unknown;
    hasNextPage?: unknown;
    filterCounts?: unknown;
  };

  return (
    typeof listMeta.totalCount === 'number' &&
    (typeof listMeta.nextCursor === 'string' || listMeta.nextCursor === null) &&
    typeof listMeta.hasNextPage === 'boolean' &&
    !!listMeta.filterCounts &&
    typeof listMeta.filterCounts === 'object'
  );
};

/**
 * 기사님 받은 견적 요청 목록 조회.
 * GET /api/users/movers/estimate-requests
 */
export const getReceivedEstimateRequests = async (
  params: ReceivedEstimateRequestsParams = {}
): Promise<EstimateRequestListResponse> => {
  const query = buildReceivedEstimateRequestsQuery(params);
  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/api/users/movers/estimate-requests${query}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: createApiTimeoutSignal(),
    }
  );

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

  if (!isEstimateRequestListResponse(body)) {
    throw new ApiError(
      response.status,
      'INVALID_RESPONSE',
      '요청 처리 중 오류가 발생했습니다.'
    );
  }

  return body;
};

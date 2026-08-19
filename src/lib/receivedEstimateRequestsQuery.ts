import { estimateRequestQueryKeys } from '@/constants/queryKey';
import { getReceivedEstimateRequests } from '@/services/estimateRequestApi';

import type {
  EstimateRequestListResponse,
  MoveTypeOption,
  RequestScopeOption,
  RequestsSortValue,
} from '@/types/estimateRequest';

export const RECEIVED_ESTIMATE_REQUESTS_PAGE_SIZE = 10;

/** 받은 요청 stale time 30초 */
export const RECEIVED_ESTIMATE_REQUESTS_STALE_TIME_MS = 30_000;

export interface ReceivedEstimateRequestsQueryInput {
  keyword?: string;
  moveTypes: MoveTypeOption[];
  scopes: RequestScopeOption[];
  sort: RequestsSortValue;
  limit?: number;
}

/** 필터 배열을 정렬해 queryKey·요청 파라미터를 안정화 */
const toStableOptions = <T extends string>(items: readonly T[]): T[] =>
  [...items].sort();

export const getReceivedEstimateRequestsNextPageParam = (
  lastPage: EstimateRequestListResponse
): string | undefined =>
  lastPage.meta.hasNextPage
    ? (lastPage.meta.nextCursor ?? undefined)
    : undefined;

/**
 * 받은 요청 무한 스크롤 Query 옵션.
 * 목록 훅과 정렬 prefetch가 같은 queryKey를 쓰도록 한곳에서 만든다.
 */
export const buildReceivedEstimateRequestsInfiniteQuery = ({
  keyword,
  moveTypes,
  scopes,
  sort,
  limit = RECEIVED_ESTIMATE_REQUESTS_PAGE_SIZE,
}: ReceivedEstimateRequestsQueryInput) => {
  const hasSelectedMoveTypes = moveTypes.length > 0;
  const hasSelectedScopes = scopes.length > 0;
  const stableMoveTypes = hasSelectedMoveTypes
    ? toStableOptions(moveTypes)
    : [];
  const stableScopes = hasSelectedScopes ? toStableOptions(scopes) : [];

  const queryParams = {
    keyword: keyword?.trim() || undefined,
    moveTypes: hasSelectedMoveTypes ? stableMoveTypes : undefined,
    scopes: hasSelectedScopes ? stableScopes : undefined,
    sort,
    limit,
  };

  return {
    queryKey: estimateRequestQueryKeys.receivedList({
      ...queryParams,
      // 미선택([])과 전체 선택(전체 배열)이 같은 키가 되지 않도록 구분
      moveTypes: hasSelectedMoveTypes ? stableMoveTypes : [],
      scopes: hasSelectedScopes ? stableScopes : [],
    }),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getReceivedEstimateRequests({
        ...queryParams,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getReceivedEstimateRequestsNextPageParam,
  };
};

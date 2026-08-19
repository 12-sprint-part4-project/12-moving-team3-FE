import { useQuery } from '@tanstack/react-query';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { moverQueryKeys } from '@/constants/queryKey';
import { ApiError } from '@/lib/apiClient';
import {
  getMoverDetail,
  toMoverCardModelFromDetail,
} from '@/services/moversApi';
import { isMoverId } from '@/types/mover';

/**
 * 기사님 상세 조회.
 * GET /api/movers/:id (User UUID)
 */
export const useMoverDetail = (moverId: string) => {
  const enabled = isMoverId(moverId);

  const query = useQuery({
    queryKey: moverQueryKeys.detail(moverId),
    queryFn: () => getMoverDetail(moverId),
    enabled,
  });

  const mover = query.data
    ? toMoverCardModelFromDetail(query.data.data)
    : undefined;

  const reviewStats = query.data?.data.reviewStats;

  const isNotFound =
    query.isError &&
    query.error instanceof ApiError &&
    (query.error.status === 404 ||
      query.error.code === API_ERROR_CODE.MOVER_NOT_FOUND);

  return {
    ...query,
    mover,
    reviewStats,
    isNotFound,
  };
};

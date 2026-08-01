import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@/services/apiClient';
import {
  getMoverDetail,
  toMoverCardModelFromDetail,
} from '@/services/moversApi';
import { isMoverId } from '@/types/mover';

import { moverQueryKeys } from './useMoversList';

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
    (!enabled && moverId.length > 0) ||
    (query.isError &&
      query.error instanceof ApiError &&
      (query.error.status === 404 || query.error.code === 'MOVER_NOT_FOUND'));

  return {
    ...query,
    mover,
    reviewStats,
    isNotFound,
  };
};

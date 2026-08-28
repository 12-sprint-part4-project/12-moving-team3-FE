import { useQuery } from '@tanstack/react-query';

import { isMoverDetailNotFound } from '@/app/(main)/movers/[id]/_lib/moverDetail.utils';
import { moverQueryKeys } from '@/constants/queryKey';
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

  const isNotFound = isMoverDetailNotFound(query.isError, query.error);

  return {
    ...query,
    mover,
    reviewStats,
    isNotFound,
  };
};

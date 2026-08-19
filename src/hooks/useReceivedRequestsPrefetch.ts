'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  buildReceivedEstimateRequestsInfiniteQuery,
  RECEIVED_ESTIMATE_REQUESTS_STALE_TIME_MS,
} from '@/lib/receivedEstimateRequestsQuery';

import type { ReceivedEstimateRequestsQueryInput } from '@/lib/receivedEstimateRequestsQuery';

/** 받은 요청 목록 쿼리 프리패치 — 정렬 hover 시 사용 */
export const useReceivedRequestsPrefetch = () => {
  const queryClient = useQueryClient();
  const { user, isReady } = useAuth();
  const isMoverReady = isReady && user?.userType === 'MOVER';

  const prefetchReceivedList = useCallback(
    (params: ReceivedEstimateRequestsQueryInput) => {
      if (!isMoverReady) {
        return;
      }

      void queryClient.prefetchInfiniteQuery({
        ...buildReceivedEstimateRequestsInfiniteQuery(params),
        staleTime: RECEIVED_ESTIMATE_REQUESTS_STALE_TIME_MS,
      });
    },
    [isMoverReady, queryClient]
  );

  return { prefetchReceivedList };
};

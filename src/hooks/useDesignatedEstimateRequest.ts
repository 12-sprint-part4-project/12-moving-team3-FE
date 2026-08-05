'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getActiveEstimateRequest } from '@/services/customerEstimateRequestApi';
import {
  createDesignatedEstimateRequest,
  getDesignatedEstimateExistence,
} from '@/services/designatedEstimateRequestApi';
import type { DesignatedEstimateExistence } from '@/lib/designatedEstimateRequestSchema';

export const designatedEstimateQueryKeys = {
  all: ['designated-estimate'] as const,
  existence: (moverId: string) =>
    [...designatedEstimateQueryKeys.all, 'existence', moverId] as const,
};

const NOT_DESIGNATED: DesignatedEstimateExistence = {
  exists: false,
  designatedEstimateRequest: null,
};

/**
 * active로 id를 구한 뒤 지정 존재 여부만 판단.
 * 조회 실패·미로그인·활성 요청 없음 → exists=false (버튼은 활성).
 */
const fetchDesignatedExistenceForMover = async (
  moverId: string
): Promise<DesignatedEstimateExistence> => {
  try {
    const active = await getActiveEstimateRequest();
    if (!active.hasActiveRequest || !active.request) {
      return NOT_DESIGNATED;
    }

    return await getDesignatedEstimateExistence(
      active.request.id,
      moverId
    );
  } catch {
    return NOT_DESIGNATED;
  }
};

/**
 * 기사님 상세에서 지정 견적 요청 · 이미 지정됐는지 상태.
 */
export const useDesignatedEstimateRequest = (moverId: string) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [needGeneralOpen, setNeedGeneralOpen] = useState(false);
  const [alreadyDesignatedOpen, setAlreadyDesignatedOpen] = useState(false);

  const isCustomer = user?.userType === 'CUSTOMER';
  const canQueryExistence = Boolean(isCustomer && moverId);

  const existenceQuery = useQuery({
    queryKey: designatedEstimateQueryKeys.existence(moverId),
    queryFn: () => fetchDesignatedExistenceForMover(moverId),
    enabled: canQueryExistence,
  });

  const isAlreadyDesignated = existenceQuery.data?.exists === true;
  const isStatusLoading = canQueryExistence && existenceQuery.isPending;

  const closeNeedGeneralModal = useCallback(() => {
    setNeedGeneralOpen(false);
  }, []);

  const closeAlreadyDesignatedModal = useCallback(() => {
    setAlreadyDesignatedOpen(false);
  }, []);

  const mutation = useMutation({
    mutationFn: async (targetMoverId: string) => {
      const active = await getActiveEstimateRequest();
      const request = active.hasActiveRequest ? active.request : null;

      if (!request || request.status !== 'SUBMITTED') {
        const error = new ApiError(
          409,
          '제출된 견적 요청에만 지정 견적을 보낼 수 있습니다.',
          'ESTIMATE_REQUEST_NOT_SUBMITTED'
        );
        throw error;
      }

      return createDesignatedEstimateRequest({
        estimateRequestId: request.id,
        moverId: targetMoverId,
      });
    },
    onSuccess: async (created, targetMoverId) => {
      queryClient.setQueryData<DesignatedEstimateExistence>(
        designatedEstimateQueryKeys.existence(targetMoverId),
        {
          exists: true,
          designatedEstimateRequest: created,
        }
      );
      showToast({ content: '지정 견적 요청을 보냈어요.' });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === 'ESTIMATE_REQUEST_NOT_SUBMITTED') {
          setNeedGeneralOpen(true);
          return;
        }

        if (error.code === 'DESIGNATED_ALREADY_EXISTS') {
          setAlreadyDesignatedOpen(true);
          queryClient.setQueryData<DesignatedEstimateExistence>(
            designatedEstimateQueryKeys.existence(moverId),
            {
              exists: true,
              designatedEstimateRequest: null,
            }
          );
          return;
        }

        showToast({ content: error.message });
        return;
      }

      showToast({ content: '지정 견적 요청 중 오류가 발생했습니다.' });
    },
  });

  const requestDesignatedEstimate = useCallback(() => {
    if (!moverId || mutation.isPending || isAlreadyDesignated || isStatusLoading) {
      return;
    }

    mutation.mutate(moverId);
  }, [moverId, mutation, isAlreadyDesignated, isStatusLoading]);

  return {
    isPending: mutation.isPending,
    isAlreadyDesignated,
    isStatusLoading,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
    requestDesignatedEstimate,
  };
};

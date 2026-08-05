'use client';

import { useCallback, useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getActiveEstimateRequest } from '@/services/customerEstimateRequestApi';
import { createDesignatedEstimateRequest } from '@/services/designatedEstimateRequestApi';

/**
 * 기사님 상세에서 지정 견적 요청.
 * - SUBMITTED 활성 요청이 없으면 need-general 모달
 * - 이미 지정이면 already-designated 모달
 */
export const useDesignatedEstimateRequest = () => {
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [needGeneralOpen, setNeedGeneralOpen] = useState(false);
  const [alreadyDesignatedOpen, setAlreadyDesignatedOpen] = useState(false);

  const closeNeedGeneralModal = useCallback(() => {
    setNeedGeneralOpen(false);
  }, []);

  const closeAlreadyDesignatedModal = useCallback(() => {
    setAlreadyDesignatedOpen(false);
  }, []);

  const requestDesignatedEstimate = useCallback(
    async (moverId: string) => {
      if (isPending || !moverId) {
        return;
      }

      setIsPending(true);

      try {
        const active = await getActiveEstimateRequest();
        const request = active.hasActiveRequest ? active.request : null;

        if (!request || request.status !== 'SUBMITTED') {
          setNeedGeneralOpen(true);
          return;
        }

        await createDesignatedEstimateRequest({
          estimateRequestId: request.id,
          moverId,
        });

        showToast({ content: '지정 견적 요청을 보냈어요.' });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.code === 'ESTIMATE_REQUEST_NOT_SUBMITTED') {
            setNeedGeneralOpen(true);
            return;
          }

          if (error.code === 'DESIGNATED_ALREADY_EXISTS') {
            setAlreadyDesignatedOpen(true);
            return;
          }

          showToast({ content: error.message });
          return;
        }

        showToast({ content: '지정 견적 요청 중 오류가 발생했습니다.' });
      } finally {
        setIsPending(false);
      }
    },
    [isPending, showToast]
  );

  return {
    isPending,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
    requestDesignatedEstimate,
  };
};

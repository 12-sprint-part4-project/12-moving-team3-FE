'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  chatQueryKeys,
  designatedEstimateQueryKeys,
} from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerPendingQuotes } from '@/hooks/useCustomerPendingQuotes';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getActiveEstimateRequest } from '@/services/customerEstimateRequestApi';
import {
  createDesignatedEstimateRequest,
  getDesignatedEstimateExistence,
} from '@/services/designatedEstimateRequestApi';

import type { DesignatedEstimateExistence } from '@/lib/designatedEstimateRequestSchema';

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

    return await getDesignatedEstimateExistence(active.request.id, moverId);
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
  const [isDesignatedRequestFailed, setIsDesignatedRequestFailed] =
    useState(false);

  const isCustomer = user?.userType === 'CUSTOMER';
  const canQueryExistence = Boolean(isCustomer && moverId);

  // 기사님 상세가 바뀌면 "이전 에러 상태"는 초기화한다.
  useEffect(() => {
    setIsDesignatedRequestFailed(false);
  }, [moverId]);

  const existenceQuery = useQuery({
    queryKey: designatedEstimateQueryKeys.existence(moverId),
    queryFn: () => fetchDesignatedExistenceForMover(moverId),
    enabled: canQueryExistence,
  });

  const pendingQuotesQuery = useCustomerPendingQuotes({
    enabled: canQueryExistence,
  });

  const isAlreadyDesignated = existenceQuery.data?.exists === true;
  /** `/movers/[id]` DESIGNATED 채팅방 생성용 EstimateDesignatedMover.id */
  const designatedMoverId =
    existenceQuery.data?.designatedEstimateRequest?.id ?? null;
  /** 지정 행에 묶인 견적요청 id — 채팅 body의estimateRequestId */
  const estimateRequestId =
    existenceQuery.data?.designatedEstimateRequest?.estimateId ?? null;
  const hasReceivedQuoteFromMover = pendingQuotesQuery.quotes.some(
    (quote) => quote.mover.moverId === moverId
  );
  /** 대기 견적 조회 실패 — 견적 수신 여부를 알 수 없으므로 요청 차단(fail-closed) */
  const isQuoteStatusError = canQueryExistence && pendingQuotesQuery.isError;
  const isStatusLoading =
    canQueryExistence &&
    (existenceQuery.isPending || pendingQuotesQuery.isPending);

  const refetchPendingQuotes = pendingQuotesQuery.refetch;

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
          API_ERROR_CODE.ESTIMATE_REQUEST_NOT_SUBMITTED
        );
        throw error;
      }

      return createDesignatedEstimateRequest({
        estimateRequestId: request.id,
        moverId: targetMoverId,
      });
    },
    onSuccess: async (created, targetMoverId) => {
      setIsDesignatedRequestFailed(false);
      queryClient.setQueryData<DesignatedEstimateExistence>(
        designatedEstimateQueryKeys.existence(targetMoverId),
        {
          exists: true,
          designatedEstimateRequest: created,
        }
      );
      // 지정 요청 후 기존 채팅방이 있으면 목록·상세를 다시 맞춰 둔다 (#208)
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.rooms(),
        }),
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.roomsAll(),
        }),
      ]);
      showToast({ content: '지정 견적 요청을 보냈어요.' });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === API_ERROR_CODE.ESTIMATE_REQUEST_NOT_SUBMITTED) {
          setNeedGeneralOpen(true);
          return;
        }

        if (error.code === API_ERROR_CODE.DESIGNATED_ALREADY_EXISTS) {
          setAlreadyDesignatedOpen(true);
          void queryClient.invalidateQueries({
            queryKey: designatedEstimateQueryKeys.existence(moverId),
          });
          return;
        }

        if (error.code === API_ERROR_CODE.QUOTE_ALREADY_RECEIVED_FROM_MOVER) {
          showToast({ content: '이미 견적을 받은 기사님입니다' });
          void refetchPendingQuotes();
          return;
        }

        // "따로 분기하지 않은" 백엔드 에러: 버튼 비활성 + 일반 토스트
        showToast({ content: error.message });
        setIsDesignatedRequestFailed(true);
        return;
      }

      // ApiError가 아닌 경우(네트워크/응답 파싱 등)도 동일하게 버튼 비활성한다.
      showToast({ content: '지정 견적 요청 중 오류가 발생했습니다.' });
      setIsDesignatedRequestFailed(true);
    },
  });

  const requestDesignatedEstimate = useCallback(() => {
    if (
      !moverId ||
      mutation.isPending ||
      isAlreadyDesignated ||
      isStatusLoading
    ) {
      return;
    }

    if (isQuoteStatusError) {
      showToast({
        content: '견적 정보를 확인하지 못했어요. 다시 시도해 주세요.',
      });
      void refetchPendingQuotes();
      return;
    }

    if (hasReceivedQuoteFromMover) {
      showToast({ content: '이미 견적을 받은 기사님입니다' });
      return;
    }

    mutation.mutate(moverId);
  }, [
    moverId,
    mutation,
    isAlreadyDesignated,
    isStatusLoading,
    isQuoteStatusError,
    hasReceivedQuoteFromMover,
    refetchPendingQuotes,
    showToast,
  ]);

  return {
    isPending: mutation.isPending,
    isAlreadyDesignated,
    designatedMoverId,
    estimateRequestId,
    hasReceivedQuoteFromMover,
    isQuoteStatusError,
    isStatusLoading,
    isDesignatedRequestFailed,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
    requestDesignatedEstimate,
  };
};

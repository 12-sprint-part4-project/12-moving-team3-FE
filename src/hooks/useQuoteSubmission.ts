'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { estimateRequestQueryKeys } from '@/hooks/useReceivedEstimateRequests';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/services/apiClient';
import { submitProposalQuote, submitRejectionQuote } from '@/services/quoteApi';

export interface UseQuoteSubmissionOptions {
  /** 견적 보내기 성공 후 모달 닫기 등 UI 후처리 */
  onProposalSuccess?: () => void;
  /** 반려 성공 후 모달 닫기 등 UI 후처리 */
  onRejectionSuccess?: () => void;
}

/** ApiError 메시지 추출 */
const getSubmitErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof ApiError ? error.message : fallback;

/**
 * 견적 보내기·반려 제출 훅
 */
export const useQuoteSubmission = ({
  onProposalSuccess,
  onRejectionSuccess,
}: UseQuoteSubmissionOptions = {}) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  );

  /** 받은 요청 목록 캐시 무효화 */
  const invalidateReceivedLists = async () => {
    await queryClient.invalidateQueries({
      queryKey: estimateRequestQueryKeys.receivedLists(),
    });
  };

  /** 제출 에러 메시지 초기화 */
  const clearSubmitError = () => {
    setSubmitErrorMessage(null);
  };

  /** 견적 보내기 제출 */
  const proposalMutation = useMutation({
    mutationFn: ({
      estimateRequestId,
      price,
      comment,
    }: {
      estimateRequestId: number;
      price: number;
      comment: string;
    }) => submitProposalQuote(estimateRequestId, { price, comment }),
    onSuccess: async () => {
      await invalidateReceivedLists();
      setSubmitErrorMessage(null);
      onProposalSuccess?.();
      showToast({
        content: '견적을 성공적으로 보냈습니다!',
      });
    },
    onError: (mutationError) => {
      setSubmitErrorMessage(
        getSubmitErrorMessage(mutationError, '견적 보내기에 실패했습니다.')
      );
    },
  });

  /** 반려 제출 */
  const rejectionMutation = useMutation({
    mutationFn: ({
      estimateRequestId,
      rejectReason,
    }: {
      estimateRequestId: number;
      rejectReason: string;
    }) => submitRejectionQuote(estimateRequestId, { rejectReason }),
    onSuccess: async () => {
      await invalidateReceivedLists();
      setSubmitErrorMessage(null);
      onRejectionSuccess?.();
      showToast({
        content: '견적 요청을 반려했습니다.',
      });
    },
    onError: (mutationError) => {
      setSubmitErrorMessage(
        getSubmitErrorMessage(mutationError, '반려 요청에 실패했습니다.')
      );
    },
  });

  return {
    submitErrorMessage,
    clearSubmitError,
    proposalMutation,
    rejectionMutation,
  };
};

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  chatQueryKeys,
  estimateRequestQueryKeys,
  moverQuoteQueryKeys,
} from '@/constants/queryKey';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { submitProposalQuote, submitRejectionQuote } from '@/services/quoteApi';

export interface UseQuoteSubmissionOptions {
  /** 견적 보내기 성공 후 모달 닫기 등 UI 후처리 */
  onProposalSuccess?: () => void;
  /** 반려 성공 후 모달 닫기 등 UI 후처리 */
  onRejectionSuccess?: () => void;
}

/** 제출 mutation 공통 설정 */
interface SubmissionMutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: () => void;
  successToastContent: string;
  errorFallbackMessage: string;
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

  /**
   * 받은 요청·내 견적·채팅 캐시 무효화.
   * 견적 상태 변경 직후 `/chat` 칩·isMessagingAllowed가 바로 맞도록 한다 (#208).
   */
  const invalidateRelatedLists = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: estimateRequestQueryKeys.receivedLists(),
      }),
      queryClient.invalidateQueries({
        queryKey: moverQuoteQueryKeys.lists(),
      }),
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      }),
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.roomDetails(),
      }),
    ]);
  };

  /** 제출 에러 메시지 초기화 */
  const clearSubmitError = () => {
    setSubmitErrorMessage(null);
  };

  /** 제출 mutation 공통 옵션 생성 */
  const createSubmissionMutation = <TData, TVariables>(
    config: SubmissionMutationConfig<TData, TVariables>
  ) => ({
    mutationFn: config.mutationFn,
    onSuccess: async () => {
      await invalidateRelatedLists();
      setSubmitErrorMessage(null);
      config.onSuccess?.();
      showToast({
        content: config.successToastContent,
      });
    },
    onError: (mutationError: unknown) => {
      setSubmitErrorMessage(
        getSubmitErrorMessage(mutationError, config.errorFallbackMessage)
      );
    },
  });

  /** 견적 보내기 제출 */
  const proposalMutation = useMutation(
    createSubmissionMutation({
      mutationFn: ({
        estimateRequestId,
        price,
        comment,
      }: {
        estimateRequestId: number;
        price: number;
        comment: string;
      }) => submitProposalQuote(estimateRequestId, { price, comment }),
      onSuccess: onProposalSuccess,
      successToastContent: '견적을 성공적으로 보냈습니다!',
      errorFallbackMessage: '견적 보내기에 실패했습니다.',
    })
  );

  /** 반려 제출 */
  const rejectionMutation = useMutation(
    createSubmissionMutation({
      mutationFn: ({
        estimateRequestId,
        rejectReason,
      }: {
        estimateRequestId: number;
        rejectReason: string;
      }) => submitRejectionQuote(estimateRequestId, { rejectReason }),
      onSuccess: onRejectionSuccess,
      successToastContent: '견적 요청을 반려했습니다.',
      errorFallbackMessage: '반려 요청에 실패했습니다.',
    })
  );

  return {
    submitErrorMessage,
    clearSubmitError,
    proposalMutation,
    rejectionMutation,
  };
};

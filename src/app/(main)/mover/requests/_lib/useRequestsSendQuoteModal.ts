'use client';

import { useState } from 'react';

import { useQuoteSubmission } from '@/hooks/useQuoteSubmission';

import type { ReceivedRequestCardModel } from '@/types/estimateRequest';

/**
 * `/mover/requests` 견적 보내기 모달.
 * 성공 시 onSent(requestId)로 목록 카드 exit를 알린다.
 */
export const useRequestsSendQuoteModal = (onSent: (requestId: number) => void) => {
  const [sendQuoteTarget, setSendQuoteTarget] =
    useState<ReceivedRequestCardModel | null>(null);

  const handleProposalSuccess = () => {
    if (sendQuoteTarget) {
      onSent(sendQuoteTarget.id);
    }
    setSendQuoteTarget(null);
  };

  const { submitErrorMessage, clearSubmitError, proposalMutation } =
    useQuoteSubmission({
      onProposalSuccess: handleProposalSuccess,
    });

  /** 견적 보내기 모달 열기 */
  const handleOpenSendQuoteModal = (request: ReceivedRequestCardModel) => {
    clearSubmitError();
    setSendQuoteTarget(request);
  };

  /** 견적 보내기 모달 닫기 */
  const handleCloseSendQuoteModal = () => {
    if (proposalMutation.isPending) {
      return;
    }
    clearSubmitError();
    setSendQuoteTarget(null);
  };

  /** 견적 보내기 API 요청 */
  const handleSendQuoteSubmit = (quote: { price: string; comment: string }) => {
    if (!sendQuoteTarget || proposalMutation.isPending) {
      return;
    }

    clearSubmitError();
    proposalMutation.mutate({
      estimateRequestId: sendQuoteTarget.id,
      price: Number(quote.price),
      comment: quote.comment,
    });
  };

  return {
    sendQuoteTarget,
    sendQuoteErrorMessage: submitErrorMessage,
    isProposalPending: proposalMutation.isPending,
    handleOpenSendQuoteModal,
    handleCloseSendQuoteModal,
    handleSendQuoteSubmit,
  };
};

'use client';

import { useState } from 'react';

import { useQuoteSubmission } from '@/hooks/useQuoteSubmission';

import type { ReceivedRequestCardModel } from '@/types/estimateRequest';

/**
 * `/mover/requests` 반려 모달.
 * 성공 시 onRejected(requestId)로 목록 카드 exit를 알린다.
 */
export const useRequestsRejectModal = (
  onRejected: (requestId: number) => void
) => {
  const [rejectTarget, setRejectTarget] =
    useState<ReceivedRequestCardModel | null>(null);

  const handleRejectionSuccess = () => {
    setRejectTarget((target) => {
      if (target) {
        onRejected(target.id);
      }
      return null;
    });
  };

  const { submitErrorMessage, clearSubmitError, rejectionMutation } =
    useQuoteSubmission({
      onRejectionSuccess: handleRejectionSuccess,
    });

  /** 반려 모달 열기 — 지정 견적 요청만 허용 */
  const handleOpenRejectModal = (request: ReceivedRequestCardModel) => {
    if (!request.isDesignated) {
      return;
    }
    clearSubmitError();
    setRejectTarget(request);
  };

  /** 반려 모달 닫기 */
  const handleCloseRejectModal = () => {
    if (rejectionMutation.isPending) {
      return;
    }
    clearSubmitError();
    setRejectTarget(null);
  };

  /** 반려 API 요청 */
  const handleRejectSubmit = (payload: { reason: string }) => {
    if (!rejectTarget || rejectionMutation.isPending) {
      return;
    }

    clearSubmitError();
    rejectionMutation.mutate({
      estimateRequestId: rejectTarget.id,
      rejectReason: payload.reason,
    });
  };

  return {
    rejectTarget,
    rejectErrorMessage: submitErrorMessage,
    isRejectionPending: rejectionMutation.isPending,
    handleOpenRejectModal,
    handleCloseRejectModal,
    handleRejectSubmit,
  };
};

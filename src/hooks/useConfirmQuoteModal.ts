'use client';

import { useState } from 'react';

import { useConfirmCustomerQuote } from '@/hooks/useConfirmCustomerQuote';

/**
 * 견적 확정 확인 모달 open/close/confirm 상태.
 * 목록·상세에서 동일 흐름을 공유한다.
 */
export const useConfirmQuoteModal = (
  onConfirmed?: (confirmedQuoteId: number) => void
) => {
  const [targetQuoteId, setTargetQuoteId] = useState<number | null>(null);
  const { confirmQuote, isConfirming, confirmingQuoteId } =
    useConfirmCustomerQuote();

  /** 확인 모달 열기 */
  const openConfirmModal = (quoteId: number) => {
    setTargetQuoteId(quoteId);
  };

  /** 확인 모달 닫기 (확정 요청 중에는 무시) */
  const closeConfirmModal = () => {
    if (isConfirming) {
      return;
    }
    setTargetQuoteId(null);
  };

  /** 모달에서 확약 → API 호출 */
  const submitConfirm = () => {
    if (targetQuoteId == null) {
      return;
    }

    const quoteId = targetQuoteId;
    confirmQuote(quoteId, {
      onSuccess: (response) => {
        setTargetQuoteId(null);
        onConfirmed?.(response.data.confirmedQuoteId);
      },
    });
  };

  return {
    isConfirmModalOpen: targetQuoteId != null,
    isConfirming,
    confirmingQuoteId,
    openConfirmModal,
    closeConfirmModal,
    submitConfirm,
  };
};

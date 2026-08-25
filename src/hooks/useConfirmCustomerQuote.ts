'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  chatQueryKeys,
  customerEstimateRequestQueryKeys,
  customerQuoteQueryKeys,
} from '@/constants/queryKey';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { ApiError } from '@/lib/apiClient';
import { confirmCustomerQuote } from '@/services/customerQuoteApi';

import type { ConfirmCustomerQuoteResponse } from '@/types/customerQuote';

/**
 * 고객 견적 확정
 */
export const useConfirmCustomerQuote = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation<ConfirmCustomerQuoteResponse, unknown, number>({
    mutationFn: (quoteId: number) => confirmCustomerQuote(quoteId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: customerQuoteQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: customerEstimateRequestQueryKeys.active(),
        }),
        // 확정 직후 채팅 칩(견적 확정)·입력 상태가 바로 반영되도록 (#208)
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.rooms(),
        }),
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.roomsAll(),
        }),
      ]);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('quotes.confirmError');
      showToast({ content: message });
    },
  });

  /** 견적 확정 — 진행 중이면 무시 */
  const confirmQuote = (
    quoteId: number,
    options?: Parameters<typeof mutation.mutate>[1]
  ): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate(quoteId, options);
  };

  return {
    confirmQuote,
    isConfirming: mutation.isPending,
    confirmingQuoteId:
      mutation.isPending && typeof mutation.variables === 'number'
        ? mutation.variables
        : null,
  };
};

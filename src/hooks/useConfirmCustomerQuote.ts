'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { customerEstimateRequestQueryKeys } from '@/hooks/useCustomerEstimateRequest';
import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { confirmCustomerQuote } from '@/services/customerQuoteApi';
import type { ConfirmCustomerQuoteResponse } from '@/types/customerQuote';

/**
 * 고객 견적 확정
 */
export const useConfirmCustomerQuote = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation<ConfirmCustomerQuoteResponse, unknown, number>({
    mutationFn: (quoteId: number) => confirmCustomerQuote(quoteId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: customerQuoteQueryKeys.pending(),
        }),
        queryClient.invalidateQueries({
          queryKey: [...customerQuoteQueryKeys.all, 'past'],
        }),
        queryClient.invalidateQueries({
          queryKey: customerQuoteQueryKeys.details(),
        }),
        queryClient.invalidateQueries({
          queryKey: customerEstimateRequestQueryKeys.active(),
        }),
      ]);

      showToast({ content: '견적이 확정되었습니다.' });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : '견적 확정에 실패했습니다.';
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

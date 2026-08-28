import { useQuery } from '@tanstack/react-query';

import { customerQuoteQueryKeys } from '@/constants/queryKey';
import {
  getCustomerPendingQuotes,
  toPendingQuotesPageModel,
} from '@/services/customerQuoteApi';

export interface UseCustomerPendingQuotesOptions {
  /** false면 조회하지 않음 (예: 받았던 견적 탭) */
  enabled?: boolean;
}

/**
 * 고객 대기 중인 견적 목록 조회 훅
 */
export const useCustomerPendingQuotes = ({
  enabled = true,
}: UseCustomerPendingQuotesOptions = {}) => {
  const query = useQuery({
    queryKey: customerQuoteQueryKeys.pending(),
    queryFn: getCustomerPendingQuotes,
    select: (response) => toPendingQuotesPageModel(response.data),
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const pageModel = query.data;
  const quotes = pageModel?.quotes ?? [];
  const summary = pageModel?.summary ?? null;
  const isWaitingForQuotes = pageModel?.isWaitingForQuotes ?? false;
  const hasNoActiveRequest =
    !query.isPending && !query.isError && summary === null;

  return {
    ...query,
    quotes,
    summary,
    isWaitingForQuotes,
    hasNoActiveRequest,
  };
};

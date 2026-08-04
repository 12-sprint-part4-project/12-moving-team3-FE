import { useQuery } from '@tanstack/react-query';

import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import {
  getCustomerQuoteDetail,
  toCustomerQuoteDetailViewModel,
} from '@/services/customerQuoteApi';

/**
 * 고객 견적 상세 조회 훅
 */
export const useCustomerQuoteDetail = (quoteId: number) => {
  const query = useQuery({
    queryKey: customerQuoteQueryKeys.detail(quoteId),
    queryFn: () => getCustomerQuoteDetail(quoteId),
    enabled: Number.isInteger(quoteId) && quoteId > 0,
    select: (response) => toCustomerQuoteDetailViewModel(response.data),
  });

  return {
    ...query,
    detail: query.data ?? null,
  };
};

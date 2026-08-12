import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import {
  getCustomerQuoteDetail,
  toCustomerQuoteDetailViewModel,
} from '@/services/customerQuoteApi';

/**
 * 고객 견적 상세 조회 훅
 */
export const useCustomerQuoteDetail = (quoteId: number) => {
  const { user, isReady } = useAuth();
  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';

  const query = useQuery({
    queryKey: customerQuoteQueryKeys.detail(quoteId),
    queryFn: () => getCustomerQuoteDetail(quoteId),
    enabled: isCustomerReady && Number.isInteger(quoteId) && quoteId > 0,
    select: (response) => toCustomerQuoteDetailViewModel(response.data),
  });

  return {
    ...query,
    detail: query.data ?? null,
  };
};

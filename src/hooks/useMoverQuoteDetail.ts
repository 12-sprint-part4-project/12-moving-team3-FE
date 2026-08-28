import { useQuery } from '@tanstack/react-query';

import { moverQuoteDetailQueryKeys } from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import {
  getMoverQuoteDetail,
  toQuoteDetailViewModel,
} from '@/services/quoteApi';

/**
 * 기사님 견적 상세 조회 훅
 */
export const useMoverQuoteDetail = (quoteId: number) => {
  const { user, isReady } = useAuth();
  const isMoverReady = isReady && user?.userType === 'MOVER';

  const query = useQuery({
    queryKey: moverQuoteDetailQueryKeys.detail(quoteId),
    queryFn: () => getMoverQuoteDetail(quoteId),
    enabled: isMoverReady && Number.isInteger(quoteId) && quoteId > 0,
    select: (data) => toQuoteDetailViewModel(data.data),
  });

  return {
    ...query,
    detail: query.data ?? null,
  };
};

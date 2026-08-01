import { useQuery } from '@tanstack/react-query';

import {
  getMoverQuoteDetail,
  toQuoteDetailViewModel,
} from '@/services/quoteApi';

import { moverQuoteQueryKeys } from './useMoverQuotes';

export const moverQuoteDetailQueryKeys = {
  all: [...moverQuoteQueryKeys.all, 'detail'] as const,
  detail: (quoteId: number) =>
    [...moverQuoteDetailQueryKeys.all, quoteId] as const,
};

/**
 * 기사님 견적 상세 조회 훅
 */
export const useMoverQuoteDetail = (quoteId: number) => {
  const query = useQuery({
    queryKey: moverQuoteDetailQueryKeys.detail(quoteId),
    queryFn: () => getMoverQuoteDetail(quoteId),
    enabled: Number.isInteger(quoteId) && quoteId > 0,
    select: (data) => toQuoteDetailViewModel(data.data),
  });

  return {
    ...query,
    detail: query.data ?? null,
  };
};

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import {
  getMoverQuotes,
  toRejectedQuoteCardModel,
  toSentQuoteCardModel,
} from '@/services/quoteApi';
import type {
  QuoteListResponse,
  QuoteListStatus,
  RejectedQuoteCardModel,
  RejectedQuoteListItem,
  SentQuoteCardModel,
  SentQuoteListItem,
} from '@/types/quote';

type SentQuoteListResponse = QuoteListResponse<SentQuoteListItem>;
type RejectedQuoteListResponse = QuoteListResponse<RejectedQuoteListItem>;

/** 목록 기본 페이지 크기 */
const DEFAULT_QUOTES_LIMIT = 8;

export const moverQuoteQueryKeys = {
  all: ['mover-quotes'] as const,
  lists: () => [...moverQuoteQueryKeys.all, 'list'] as const,
  list: (status: QuoteListStatus, page: number, limit: number) =>
    [...moverQuoteQueryKeys.lists(), { status, page, limit }] as const,
};

export interface UseMoverQuotesParams {
  status: QuoteListStatus;
  page: number;
  limit?: number;
}

interface QuoteListQueryKeyParams {
  status: QuoteListStatus;
  page: number;
  limit: number;
}

interface MoverQuotesViewData {
  quotes: SentQuoteCardModel[] | RejectedQuoteCardModel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/** queryKey에서 목록 파라미터 추출 */
const getListKeyParams = (
  queryKey: readonly unknown[]
): QuoteListQueryKeyParams | null => {
  const params = queryKey[2];
  if (!params || typeof params !== 'object') {
    return null;
  }

  const { status, page, limit } = params as Partial<QuoteListQueryKeyParams>;
  if (
    (status !== 'SENT' && status !== 'REJECTED') ||
    typeof page !== 'number' ||
    typeof limit !== 'number'
  ) {
    return null;
  }

  return { status, page, limit };
};

/** 보낸 견적 목록 응답 → 카드 UI 모델 변환 */
const selectSentQuotesView = (
  data: SentQuoteListResponse
): MoverQuotesViewData => ({
  quotes: data.data.items.map(toSentQuoteCardModel),
  totalCount: data.meta.totalCount,
  totalPages: data.meta.totalPages,
  currentPage: data.meta.currentPage,
});

/** 반려 견적 목록 응답 → 카드 UI 모델 변환 */
const selectRejectedQuotesView = (
  data: RejectedQuoteListResponse
): MoverQuotesViewData => ({
  quotes: data.data.items.map(toRejectedQuoteCardModel),
  totalCount: data.meta.totalCount,
  totalPages: data.meta.totalPages,
  currentPage: data.meta.currentPage,
});

/**
 * 기사님 보낸 견적 / 반려 요청 목록 조회 훅
 */
export const useMoverQuotes = ({
  status,
  page,
  limit = DEFAULT_QUOTES_LIMIT,
}: UseMoverQuotesParams) => {
  const { user, isReady } = useAuth();
  const isMoverReady = isReady && user?.userType === 'MOVER';

  const query = useQuery({
    queryKey: moverQuoteQueryKeys.list(status, page, limit),
    queryFn: async (): Promise<MoverQuotesViewData> => {
      if (status === 'SENT') {
        const data = await getMoverQuotes({ status: 'SENT', page, limit });
        return selectSentQuotesView(data);
      }

      const data = await getMoverQuotes({ status: 'REJECTED', page, limit });
      return selectRejectedQuotesView(data);
    },
    enabled: isMoverReady,
    placeholderData: (
      previousData: MoverQuotesViewData | undefined,
      previousQuery
    ) => {
      const previousParams = previousQuery
        ? getListKeyParams(previousQuery.queryKey)
        : null;

      // 탭(status)이 같을 때만 페이지 전환용 placeholder 유지
      if (!previousParams || previousParams.status !== status) {
        return undefined;
      }

      return previousData;
    },
  });

  const quotes = query.data?.quotes ?? [];
  const totalPages = query.data?.totalPages ?? 0;
  const currentPage = query.data?.currentPage ?? page;

  return {
    ...query,
    quotes,
    totalCount: query.data?.totalCount ?? 0,
    totalPages,
    currentPage,
    isEmpty: !query.isPending && !query.isError && quotes.length === 0,
  };
};

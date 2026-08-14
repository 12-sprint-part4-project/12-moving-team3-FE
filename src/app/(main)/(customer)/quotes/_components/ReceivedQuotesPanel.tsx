'use client';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import { QuotesLoadMoreSentinel } from '@/components/quotes/QuotesLoadMoreSentinel';
import { ReceivedQuotesListSkeleton } from '@/components/ui/Skeleton';
import {
  PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { useListEntranceStagger } from '@/hooks/useListEntranceStagger';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { CustomerQuotesEmptyState } from './CustomerQuotesEmptyState';
import { CUSTOMER_QUOTES_CONTENT_CLASS } from './customerQuotesLayout';
import { ReceivedQuoteGroupSection } from './ReceivedQuoteGroupSection';

/** 받았던 견적 탭 패널 props */
interface ReceivedQuotesPanelProps {
  enabled: boolean;
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** `/quotes?tab=received` 탭 본문. - 그룹 Query·무한스크롤. */
export const ReceivedQuotesPanel = ({
  enabled,
  onFavoriteClick,
  isMoverPending,
}: ReceivedQuotesPanelProps) => {
  const {
    groups,
    isEmpty,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCustomerPastQuotes({
    limit: PAST_QUOTE_GROUP_LIMIT,
    enabled,
  });

  const staggerOnEntrance = useListEntranceStagger(isPending);
  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  const errorMessage = resolveApiErrorMessage(
    error,
    '견적 목록을 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  // 로딩 — 받았던 견적 목록 스켈레톤
  if (isPending) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <ReceivedQuotesListSkeleton />
      </div>
    );
  }

  // 에러 — 재시도
  if (isError) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <QuotesListErrorState
          message={errorMessage}
          onRetry={handleRetry}
          withMotion={false}
        />
      </div>
    );
  }

  // 빈 상태 — 받았던 견적 없음
  if (isEmpty) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <CustomerQuotesEmptyState variant="receivedEmpty" />
      </div>
    );
  }

  // 본문 — 요청 그룹 섹션 + 무한스크롤
  return (
    <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
      <div className="mx-auto flex w-full max-w-[87.5rem] flex-col gap-6 md:gap-8 lg:gap-10">
        {groups.map((group) => (
          <ReceivedQuoteGroupSection
            key={group.estimateRequestId}
            group={group}
            staggerOnEntrance={staggerOnEntrance}
            onFavoriteClick={onFavoriteClick}
            isMoverPending={isMoverPending}
          />
        ))}

        <QuotesLoadMoreSentinel
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
};

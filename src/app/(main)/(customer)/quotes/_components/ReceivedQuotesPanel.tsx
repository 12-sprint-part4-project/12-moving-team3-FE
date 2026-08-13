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
import { ApiError } from '@/lib/apiClient';

import { CUSTOMER_QUOTES_CONTENT_CLASS } from './customerQuotesLayout';
import { PendingQuotesEmptyState } from './PendingQuotesEmptyState';
import { ReceivedQuoteGroupSection } from './ReceivedQuoteGroupSection';

interface ReceivedQuotesPanelProps {
  enabled: boolean;
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** 받았던 견적 탭 본문. 그룹 조회·무한스크롤·필터 섹션을 담당한다. */
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
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '견적 목록을 불러오지 못했습니다.';

  const handleRetry = () => {
    void refetch();
  };

  if (isPending) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <ReceivedQuotesListSkeleton />
      </div>
    );
  }

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

  if (isEmpty) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <PendingQuotesEmptyState variant="receivedEmpty" />
      </div>
    );
  }

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

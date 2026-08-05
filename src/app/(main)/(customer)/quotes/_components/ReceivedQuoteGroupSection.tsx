'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type {
  CustomerPastQuoteFilter,
  QuoteInfoViewModel,
  ReceivedQuoteCardModel,
  ReceivedQuoteGroupModel,
} from '@/types/customerQuote';

import { ReceivedQuoteCard } from './ReceivedQuoteCard';
import { ReceivedQuotesFilter } from './ReceivedQuotesFilter';

interface InfoRowsProps {
  info: QuoteInfoViewModel;
  className?: string;
}

/** 견적 정보 행 */
const InfoRows = ({ info, className }: InfoRowsProps) => {
  const rows = [
    { label: '견적 요청일', value: info.requestedAtLabel },
    { label: '서비스', value: info.serviceLabel },
    { label: '이용일', value: info.moveDateLabel },
    { label: '출발지', value: info.departure },
    { label: '도착지', value: info.arrival },
  ];

  return (
    <dl
      className={cn(
        'flex w-full flex-col gap-2 rounded-2xl bg-background-200 px-5 py-4 md:gap-2 md:px-10 md:py-8 lg:gap-2.5',
        className
      )}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start gap-[2.5rem] text-md-medium lg:gap-[2rem] lg:text-2lg-medium"
        >
          <dt className="w-[4.0625rem] shrink-0 text-gray-300 lg:w-[5.75rem]">
            {row.label}
          </dt>
          <dd className="min-w-0 break-keep text-black-400">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

/** 그룹 내 필터 적용 */
const filterQuotesByStatus = (
  quotes: ReceivedQuoteCardModel[],
  filter: CustomerPastQuoteFilter
): ReceivedQuoteCardModel[] => {
  if (filter === 'CONFIRMED') {
    return quotes.filter((quote) => quote.isConfirmed);
  }
  return quotes;
};

export interface ReceivedQuoteGroupSectionProps {
  group: ReceivedQuoteGroupModel;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending?: (moverId: string) => boolean;
  className?: string;
}

/**
 * 받았던 견적 블록
 */
export const ReceivedQuoteGroupSection = ({
  group,
  onFavoriteClick,
  isMoverPending,
  className = '',
}: ReceivedQuoteGroupSectionProps) => {
  const [filter, setFilter] = useState<CustomerPastQuoteFilter>('ALL');

  const visibleQuotes = useMemo(
    () => filterQuotesByStatus(group.quotes, filter),
    [group.quotes, filter]
  );

  return (
    <section
      className={cn(
        'flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-6 md:gap-8 md:px-8 md:py-8 lg:gap-10 lg:px-10 lg:py-12',
        className
      )}
      aria-labelledby={`received-group-${group.estimateRequestId}-info`}
    >
      {/* 견적 정보 */}
      <div className="flex w-full flex-col gap-4 lg:gap-8">
        <h2
          id={`received-group-${group.estimateRequestId}-info`}
          className="text-lg-semibold text-black-400 lg:text-2xl-semibold"
        >
          견적 정보
        </h2>
        <InfoRows info={group.info} />
      </div>

      {/* 견적서 목록 — 이 그룹 안에서만 필터 */}
      <div className="flex w-full flex-col gap-3 md:gap-4 lg:gap-6">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
          견적서 목록
        </h2>
        <ReceivedQuotesFilter value={filter} onValueChange={setFilter} />
        {visibleQuotes.length > 0 ? (
          <ul className="flex w-full flex-col gap-6 lg:gap-8">
            {visibleQuotes.map((quote) => (
              <li key={quote.quoteId}>
                <ReceivedQuoteCard
                  quote={quote}
                  onFavoriteClick={onFavoriteClick}
                  isFavoritePending={isMoverPending?.(quote.mover.moverId)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-lg-regular text-gray-400">
            {filter === 'CONFIRMED'
              ? '확정한 견적서가 없어요.'
              : '받은 견적서가 없어요.'}
          </p>
        )}
      </div>
    </section>
  );
};

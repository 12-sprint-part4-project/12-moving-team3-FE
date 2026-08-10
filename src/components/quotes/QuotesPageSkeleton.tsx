import { cn } from '@/lib/utils';

const LIST_SKELETON_COUNT = 4;
const RECEIVED_CARD_SKELETON_COUNT = 2;

/** 견적 카드 자리 표시용 스켈레톤 (대기 중·기사 목록용) */
const QuoteCardSkeleton = () => (
  <div
    className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-request-card lg:gap-5 lg:p-6"
    aria-hidden
  >
    <div className="flex flex-wrap gap-2">
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200" />
      <div className="h-7 w-20 animate-pulse rounded-full bg-background-200" />
    </div>
    <div className="h-6 w-32 animate-pulse rounded bg-background-200 lg:h-7" />
    <div className="flex flex-col gap-2">
      <div className="h-5 w-full max-w-[16rem] animate-pulse rounded bg-background-200" />
      <div className="h-5 w-full max-w-[20rem] animate-pulse rounded bg-background-200" />
      <div className="h-5 w-full max-w-[14rem] animate-pulse rounded bg-background-200" />
    </div>
    <div className="mt-1 h-7 w-28 animate-pulse rounded bg-background-200 lg:h-8 lg:w-36" />
  </div>
);

/** 받았던 견적 카드(프로필형) 자리 표시 */
const ReceivedQuoteCardSkeleton = () => (
  <div
    className="flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 lg:gap-4 lg:px-6 lg:py-5"
    aria-hidden
  >
    <div className="flex flex-wrap gap-2">
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200" />
      <div className="h-7 w-14 animate-pulse rounded-full bg-background-200" />
    </div>
    <div className="h-6 w-3/4 max-w-[20rem] animate-pulse rounded bg-background-200 lg:h-7" />
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-background-200 lg:h-14 lg:w-14" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-5 w-28 animate-pulse rounded bg-background-200" />
        <div className="h-4 w-40 animate-pulse rounded bg-background-200" />
      </div>
    </div>
    <div className="h-6 w-24 animate-pulse rounded bg-background-200 lg:h-7" />
  </div>
);

/** 받았던 견적 그룹(견적 정보 + 견적서 목록) 스켈레톤 */
const ReceivedQuoteGroupSkeleton = () => (
  <section
    className="flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-6 md:gap-8 md:px-8 md:py-8 lg:gap-10 lg:px-10 lg:py-12"
    aria-hidden
  >
    <div className="flex w-full flex-col gap-4 lg:gap-8">
      <div className="h-6 w-20 animate-pulse rounded bg-background-200 lg:h-8 lg:w-24" />
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-background-200 px-5 py-4 md:gap-2 md:px-10 md:py-8 lg:gap-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-start gap-10 lg:gap-8">
            <div className="h-5 w-[4.0625rem] shrink-0 animate-pulse rounded bg-line-100 lg:h-6 lg:w-[5.75rem]" />
            <div className="h-5 w-full max-w-[12rem] animate-pulse rounded bg-line-100 lg:h-6 lg:max-w-[16rem]" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex w-full flex-col gap-3 md:gap-4 lg:gap-6">
      <div className="h-6 w-24 animate-pulse rounded bg-background-200 lg:h-8 lg:w-28" />
      <div className="flex gap-2">
        <div className="h-9 w-16 animate-pulse rounded-full bg-background-200" />
        <div className="h-9 w-20 animate-pulse rounded-full bg-background-200" />
      </div>
      <ul className="m-0 flex w-full list-none flex-col gap-6 p-0 lg:gap-8">
        {Array.from({ length: RECEIVED_CARD_SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <ReceivedQuoteCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/** 탭 바 자리 표시용 스켈레톤 */
const QuotesTabsSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title',
      className
    )}
    aria-hidden
  >
    <div className="flex items-start gap-6 lg:gap-8">
      <div className="h-8 w-28 animate-pulse rounded bg-background-200 lg:h-9 lg:w-32" />
      <div className="h-8 w-24 animate-pulse rounded bg-background-200 lg:h-9 lg:w-28" />
    </div>
  </div>
);

/** 목록 카드만 */
export const QuotesListSkeleton = ({
  className = '',
}: {
  className?: string;
}) => (
  <div
    className={className}
    role="status"
    aria-busy="true"
    aria-label="목록 불러오는 중"
  >
    <ul className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8">
      {Array.from({ length: LIST_SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <QuoteCardSkeleton />
        </li>
      ))}
    </ul>
  </div>
);

/** 받았던 견적 탭 pending용 — 그룹 섹션 윤곽 */
export const ReceivedQuotesListSkeleton = ({
  className = '',
  groupCount = 1,
}: {
  className?: string;
  groupCount?: number;
}) => (
  <div
    className={cn(
      'mx-auto flex w-full max-w-[87.5rem] flex-col gap-6 md:gap-8 lg:gap-10',
      className
    )}
    role="status"
    aria-busy="true"
    aria-label="목록 불러오는 중"
  >
    {Array.from({ length: groupCount }, (_, index) => (
      <ReceivedQuoteGroupSkeleton key={index} />
    ))}
  </div>
);

export interface QuotesPageContentSkeletonProps {
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
}

/**
 * 탭 + 목록 본문 스켈레톤 — Suspense fallback용
 */
export const QuotesPageContentSkeleton = ({
  className,
  tabsClassName,
  contentClassName,
}: QuotesPageContentSkeletonProps) => (
  <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
    <QuotesTabsSkeleton className={cn(className, tabsClassName)} />
    <div className="min-h-0 w-full flex-1 bg-background-200">
      <div
        className={cn(
          'mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10',
          className,
          contentClassName
        )}
      >
        <QuotesListSkeleton />
      </div>
    </div>
  </div>
);

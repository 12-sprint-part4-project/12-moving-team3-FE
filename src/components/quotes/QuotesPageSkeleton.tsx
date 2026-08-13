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
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
      <div className="h-7 w-20 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
    </div>
    <div className="h-6 w-32 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-7" />
    <div className="flex flex-col gap-2">
      <div className="h-5 w-full max-w-[16rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
      <div className="h-5 w-full max-w-[20rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
      <div className="h-5 w-full max-w-[14rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
    </div>
    <div className="mt-1 h-7 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-8 lg:w-36" />
  </div>
);

/** 받았던 견적 카드(프로필형) 자리 표시 */
const ReceivedQuoteCardSkeleton = () => (
  <div
    className="flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 lg:gap-4 lg:px-6 lg:py-5"
    aria-hidden
  >
    <div className="flex flex-wrap gap-2">
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
      <div className="h-7 w-14 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
    </div>
    <div className="h-6 w-3/4 max-w-[20rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-7" />
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none lg:h-14 lg:w-14" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-5 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
        <div className="h-4 w-40 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
      </div>
    </div>
    <div className="h-6 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-7" />
  </div>
);

/** 받았던 견적 그룹(견적 정보 + 견적서 목록) 스켈레톤 */
const ReceivedQuoteGroupSkeleton = () => (
  <section
    className="flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-6 md:gap-8 md:px-8 md:py-8 lg:gap-10 lg:px-10 lg:py-12"
    aria-hidden
  >
    <div className="flex w-full flex-col gap-4 lg:gap-8">
      <div className="h-6 w-20 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-8 lg:w-24" />
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-background-200 px-5 py-4 md:gap-2 md:px-10 md:py-8 lg:gap-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-start gap-10 lg:gap-8">
            <div className="h-5 w-[4.0625rem] shrink-0 animate-pulse rounded bg-line-100 motion-reduce:animate-none lg:h-6 lg:w-[5.75rem]" />
            <div className="h-5 w-full max-w-[12rem] animate-pulse rounded bg-line-100 motion-reduce:animate-none lg:h-6 lg:max-w-[16rem]" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex w-full flex-col gap-3 md:gap-4 lg:gap-6">
      <div className="h-6 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-8 lg:w-28" />
      <div className="flex gap-2">
        <div className="h-9 w-16 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
        <div className="h-9 w-20 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
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

/** 대기 중 견적 — 요청 요약 SubHeader 스켈레톤 */
export const PendingRequestSubHeaderSkeleton = ({
  className,
}: {
  className?: string;
}) => (
  <div
    className={cn(className)}
    role="status"
    aria-busy="true"
    aria-label="요청 정보 불러오는 중"
  >
    <section
      className="flex w-full flex-col items-start bg-white px-6 py-5 shadow-[0_0.5rem_0.625rem_0_rgb(39_39_75/0.02)] md:px-[4.5rem] md:py-8 lg:px-10 lg:py-8 xl:px-16 min-[90rem]:px-[16.25rem]"
      aria-hidden
    >
      <div className="flex w-full flex-col items-start justify-end gap-5 md:gap-7 lg:flex-row lg:items-end lg:gap-5">
        <div className="flex w-full flex-col items-start gap-2 lg:min-w-0 lg:flex-1">
          <div className="h-6 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none md:h-8 md:w-28" />
          <div className="h-4 w-40 animate-pulse rounded bg-background-200 motion-reduce:animate-none md:h-5 md:w-48" />
        </div>

        <div className="flex w-full flex-col gap-2 md:hidden">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between"
            >
              <div className="h-4 w-12 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
              <div className="h-4 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
            </div>
          ))}
        </div>

        <div className="hidden shrink-0 items-start gap-10 md:flex md:w-full lg:w-auto">
          <div className="flex shrink-0 items-end gap-3">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-12 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
              <div className="h-6 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
            </div>
            <div className="mb-[0.1875rem] h-5 w-2 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-12 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
              <div className="h-6 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
            <div className="h-6 w-36 animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </section>
  </div>
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
      <div className="h-8 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-9 lg:w-32" />
      <div className="h-8 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-9 lg:w-28" />
    </div>
  </div>
);

/** 목록 카드만 */
export const QuotesListSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(className)}
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

/** 이용 내역 카드 — QuoteListCard + 하단 CTA 자리 */
const HistoryQuoteCardSkeleton = () => (
  <div
    className="relative flex h-full w-full flex-col gap-6.5 overflow-hidden rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3"
    aria-hidden
  >
    <div className="flex w-full items-center justify-between gap-2 lg:gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2 lg:gap-3">
        <div className="h-7 w-16 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
        <div className="h-7 w-14 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
      </div>
      <div className="hidden h-4 w-16 shrink-0 animate-pulse rounded bg-background-200 motion-reduce:animate-none md:block" />
    </div>
    <div className="flex flex-col gap-2">
      <div className="h-6 w-40 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-7" />
      <div className="h-5 w-full max-w-[16rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
      <div className="h-5 w-full max-w-[20rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
      <div className="h-5 w-full max-w-[14rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none" />
    </div>
    <div className="flex w-full items-end justify-end gap-2 lg:h-10 lg:gap-4">
      <div className="h-5 w-16 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-6" />
      <div className="h-7 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-8 lg:w-36" />
    </div>
    <div className="flex w-full flex-col gap-2 md:flex-row md:gap-3">
      <div className="h-12 w-full animate-pulse rounded-lg bg-background-200 motion-reduce:animate-none lg:h-14 lg:rounded-2xl" />
      <div className="h-12 w-full animate-pulse rounded-lg bg-background-200 motion-reduce:animate-none lg:h-14 lg:rounded-2xl" />
    </div>
  </div>
);

const HISTORY_PAGE_X_PADDING =
  'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

/** 이용 내역 목록 카드 그리드 스켈레톤 */
export const QuotesHistoryListSkeleton = ({
  className = '',
  count = LIST_SKELETON_COUNT,
}: {
  className?: string;
  count?: number;
}) => (
  <div
    className={cn(className)}
    role="status"
    aria-busy="true"
    aria-label="이용 내역 불러오는 중"
  >
    <ul className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <HistoryQuoteCardSkeleton />
        </li>
      ))}
    </ul>
  </div>
);

/** 이용 내역 본문 영역 스켈레톤 */
export interface QuotesHistoryPageSkeletonProps {
  className?: string;
  pageXPadding?: string;
}

export const QuotesHistoryPageSkeleton = ({
  className,
  pageXPadding = HISTORY_PAGE_X_PADDING,
}: QuotesHistoryPageSkeletonProps) => (
  <div className={cn('min-h-0 w-full flex-1 bg-background-200', className)}>
    <div
      className={cn(
        'mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10',
        pageXPadding
      )}
    >
      <QuotesHistoryListSkeleton />
    </div>
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
  /** false면 탭 스켈레톤 없이 목록만 */
  withTabs?: boolean;
  /** 고객 대기 중 견적 SubHeader 스켈레톤 */
  withSubHeader?: boolean;
}

/**
 * 목록 본문 스켈레톤 — Suspense fallback용
 */
export const QuotesPageContentSkeleton = ({
  className,
  tabsClassName,
  contentClassName,
  withTabs = true,
  withSubHeader = false,
}: QuotesPageContentSkeletonProps) => (
  <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
    {withTabs ? (
      <QuotesTabsSkeleton className={cn(className, tabsClassName)} />
    ) : null}
    <div className="min-h-0 w-full flex-1 bg-background-200">
      {withSubHeader ? <PendingRequestSubHeaderSkeleton /> : null}
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

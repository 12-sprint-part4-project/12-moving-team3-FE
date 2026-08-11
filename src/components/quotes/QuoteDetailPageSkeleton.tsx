import { cn } from '@/lib/utils';

const DETAIL_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/** 상세 상단 요약 카드 자리 */
const DetailSummaryCardSkeleton = () => (
  <div
    className="flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 lg:gap-4 lg:px-6 lg:py-5"
    aria-hidden
  >
    <div className="flex flex-wrap gap-2">
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200" />
      <div className="h-7 w-14 animate-pulse rounded-full bg-background-200" />
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200" />
    </div>
    <div className="h-6 w-40 animate-pulse rounded bg-background-200 lg:h-7" />
    <div className="flex flex-col gap-2">
      <div className="h-5 w-full max-w-[18rem] animate-pulse rounded bg-background-200" />
      <div className="h-5 w-full max-w-[22rem] animate-pulse rounded bg-background-200" />
      <div className="h-5 w-full max-w-[16rem] animate-pulse rounded bg-background-200" />
    </div>
  </div>
);

/** 견적가·정보 등 본문 블록 자리 */
const DetailBodySkeleton = () => (
  <div className="flex w-full flex-col gap-6 md:gap-8 lg:gap-10" aria-hidden>
    <div className="h-px w-full bg-line-100" />
    <div className="flex w-full flex-col gap-4 lg:gap-8">
      <div className="h-6 w-16 animate-pulse rounded bg-background-200 lg:h-8 lg:w-20" />
      <div className="h-8 w-36 animate-pulse rounded bg-background-200 lg:h-10 lg:w-44" />
    </div>
    <div className="h-px w-full bg-line-100" />
    <div className="flex w-full flex-col gap-5 lg:gap-10">
      <div className="h-6 w-20 animate-pulse rounded bg-background-200 lg:h-8 lg:w-24" />
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-line-100 bg-background-200 px-5 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-start gap-6 lg:gap-8">
            <div className="h-5 w-[4.0625rem] shrink-0 animate-pulse rounded bg-line-100 lg:h-6 lg:w-[5.75rem]" />
            <div className="h-5 w-full max-w-[14rem] animate-pulse rounded bg-line-100 lg:h-6 lg:max-w-[18rem]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/** 데스크톱 우측 — 고객: CTA + 공유 */
const DetailCtaAsideSkeleton = () => (
  <aside
    className="col-start-1 hidden w-full flex-col gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:w-[20.5rem]"
    aria-hidden
  >
    <div className="h-14 w-full animate-pulse rounded-2xl bg-background-200" />
    <div className="h-14 w-full animate-pulse rounded-2xl bg-background-200" />
    <div className="mt-4 flex flex-col gap-3">
      <div className="h-5 w-24 animate-pulse rounded bg-background-200" />
      <div className="flex gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-background-200" />
        <div className="h-12 w-12 animate-pulse rounded-full bg-background-200" />
        <div className="h-12 w-12 animate-pulse rounded-full bg-background-200" />
      </div>
    </div>
  </aside>
);

/** 데스크톱 우측 — 기사: 채팅 + 공유 */
const DetailShareAsideSkeleton = () => (
  <aside
    className="col-start-1 hidden w-full flex-col gap-10 lg:col-start-2 lg:row-span-1 lg:row-start-1 lg:flex"
    aria-hidden
  >
    <div className="h-14 w-full animate-pulse rounded-2xl bg-background-200" />
    <div className="h-px w-full bg-line-100" />
    <div className="flex flex-col gap-3">
      <div className="h-5 w-24 animate-pulse rounded bg-background-200" />
      <div className="flex gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-background-200" />
        <div className="h-12 w-12 animate-pulse rounded-full bg-background-200" />
        <div className="h-12 w-12 animate-pulse rounded-full bg-background-200" />
      </div>
    </div>
  </aside>
);

/** 상세 우측 aside 변형 */
export type QuoteDetailAsideVariant = 'cta' | 'share' | 'none';

export interface QuoteDetailContentSkeletonProps {
  className?: string;
  /**
   * 우측 aside 구성
   * - cta: 고객 상세 (확정 CTA + 공유)
   * - share: 기사 보낸 견적 (채팅 + 공유)
   * - none: 반려 등 aside 없음
   */
  aside?: QuoteDetailAsideVariant;
}

const ASIDE_GRID_CLASS: Record<QuoteDetailAsideVariant, string> = {
  cta: 'lg:grid-cols-[minmax(0,59.6875rem)_20.5rem]',
  share: 'lg:grid-cols-[minmax(0,59.6875rem)_auto]',
  none: '',
};

/**
 * 견적 상세 본문 스켈레톤
 */
export const QuoteDetailContentSkeleton = ({
  className,
  aside = 'cta',
}: QuoteDetailContentSkeletonProps) => (
  <div
    className={cn(
      'mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:items-start lg:justify-between lg:gap-10 lg:py-10',
      ASIDE_GRID_CLASS[aside],
      DETAIL_PAGE_X_PADDING,
      className
    )}
    role="status"
    aria-busy="true"
    aria-label="견적 상세 불러오는 중"
  >
    <div className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10">
      <DetailSummaryCardSkeleton />
      <DetailBodySkeleton />
    </div>
    {aside === 'cta' ? <DetailCtaAsideSkeleton /> : null}
    {aside === 'share' ? <DetailShareAsideSkeleton /> : null}
  </div>
);

export { DETAIL_PAGE_X_PADDING };

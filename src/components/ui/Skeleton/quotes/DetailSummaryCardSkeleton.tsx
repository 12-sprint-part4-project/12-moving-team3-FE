/** 상세 상단 요약 카드 자리 */
export const DetailSummaryCardSkeleton = () => (
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

/** 받았던 견적 카드(프로필형) 자리 표시 */
export const ReceivedQuoteCardSkeleton = () => (
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

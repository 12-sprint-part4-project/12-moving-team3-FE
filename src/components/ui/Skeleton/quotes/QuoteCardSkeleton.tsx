/** 견적 카드 자리 표시용 스켈레톤 (대기 중·기사 목록용) */
export const QuoteCardSkeleton = () => (
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

/** 이용 내역 카드 — QuoteListCard + 하단 CTA 자리 */
export const HistoryQuoteCardSkeleton = () => (
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

/** 데스크톱 우측 — 고객: CTA + 공유 */
export const DetailCtaAsideSkeleton = () => (
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

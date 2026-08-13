/** 데스크톱 우측 — 기사: 채팅 + 공유 */
export const DetailShareAsideSkeleton = () => (
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

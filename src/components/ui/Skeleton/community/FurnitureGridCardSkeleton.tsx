/** 중고 가구 그리드 카드 자리 표시용 스켈레톤 */
export const FurnitureGridCardSkeleton = () => (
  <div
    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-request-card"
    aria-hidden
  >
    <div className="aspect-square w-full animate-pulse bg-background-200" />
    <div className="flex flex-col gap-1.5 px-2.5 py-2 min-[46.5rem]:gap-2 min-[46.5rem]:px-3 min-[46.5rem]:py-2.5 xl:px-3.5 xl:py-3">
      <div className="h-4 w-4/5 animate-pulse rounded bg-background-200 min-[46.5rem]:h-5" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-background-200 min-[46.5rem]:h-4" />
    </div>
  </div>
);

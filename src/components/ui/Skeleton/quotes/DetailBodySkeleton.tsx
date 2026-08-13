/** 견적가·정보 등 본문 블록 자리 */
export const DetailBodySkeleton = () => (
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

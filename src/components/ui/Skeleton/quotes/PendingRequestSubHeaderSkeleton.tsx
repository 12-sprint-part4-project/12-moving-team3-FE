import { cn } from '@/lib/utils';

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

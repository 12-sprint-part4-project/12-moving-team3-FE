import { cn } from '@/lib/utils';

const LIST_SKELETON_COUNT = 3;

/** 받은 요청 카드 자리 표시용 스켈레톤 */
const RequestCardSkeleton = () => (
  <div
    className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-request-card lg:gap-6 lg:p-6"
    aria-hidden
  >
    <div className="flex flex-wrap gap-2">
      <div className="h-7 w-16 animate-pulse rounded-full bg-background-200" />
      <div className="h-7 w-20 animate-pulse rounded-full bg-background-200" />
    </div>
    <div className="h-6 w-28 animate-pulse rounded bg-background-200 lg:h-7" />
    <div className="flex flex-col gap-2">
      <div className="h-5 w-full max-w-[18rem] animate-pulse rounded bg-background-200" />
      <div className="h-5 w-full max-w-[22rem] animate-pulse rounded bg-background-200" />
      <div className="h-5 w-full max-w-[16rem] animate-pulse rounded bg-background-200" />
    </div>
    <div className="flex gap-2 pt-1">
      <div className="h-12 w-full animate-pulse rounded-2xl bg-background-200 lg:h-14" />
      <div className="hidden h-14 w-full animate-pulse rounded-2xl bg-background-200 lg:block" />
    </div>
  </div>
);

/** 사이드 필터 자리 표시용 스켈레톤 (xl 이상) */
const SidebarFilterSkeleton = () => (
  <aside
    className="hidden w-full max-w-[20.5rem] shrink-0 flex-col gap-8 xl:flex"
    aria-hidden
  >
    <div className="flex flex-col gap-4">
      <div className="h-6 w-24 animate-pulse rounded bg-background-200" />
      <div className="flex flex-col gap-3">
        <div className="h-5 w-full animate-pulse rounded bg-background-200" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-background-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-background-200" />
      </div>
    </div>
    <div className="flex flex-col gap-4">
      <div className="h-6 w-20 animate-pulse rounded bg-background-200" />
      <div className="flex flex-col gap-3">
        <div className="h-5 w-full animate-pulse rounded bg-background-200" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-background-200" />
      </div>
    </div>
  </aside>
);

/** 목록 카드만 — API pending 시 툴바·필터는 유지한 채 사용 */
export const RequestsListSkeleton = ({
  className = '',
}: {
  className?: string;
}) => (
  <div
    className={className}
    role="status"
    aria-busy="true"
    aria-label="목록 불러오는 중"
  >
    <ul className="m-0 flex w-full list-none flex-col gap-6 p-0 lg:gap-12">
      {Array.from({ length: LIST_SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <RequestCardSkeleton />
        </li>
      ))}
    </ul>
  </div>
);

export interface RequestsPageContentSkeletonProps {
  className?: string;
}

/**
 * 제목 아래 본문 스켈레톤
 */
export const RequestsPageContentSkeleton = ({
  className,
}: RequestsPageContentSkeletonProps) => (
  <div
    className={cn(
      'mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-6 py-6 md:px-[4.5rem] md:py-8 lg:px-10 xl:flex-row xl:items-start xl:gap-8 xl:px-16 min-[90rem]:gap-12 min-[90rem]:px-[16.25rem]',
      className
    )}
    role="status"
    aria-busy="true"
    aria-label="목록 불러오는 중"
  >
    <SidebarFilterSkeleton />

    <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-8">
      <div className="flex w-full flex-col gap-4 lg:gap-6" aria-hidden>
        <div className="h-12 w-full animate-pulse rounded-2xl bg-background-200 lg:h-16" />
        <div className="flex items-center justify-between gap-3">
          <div className="h-6 w-24 animate-pulse rounded bg-background-200" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 animate-pulse rounded bg-background-200" />
            <div className="h-8 w-28 animate-pulse rounded bg-background-200" />
            <div className="h-8 w-8 animate-pulse rounded bg-background-200 xl:hidden" />
          </div>
        </div>
      </div>

      <RequestsListSkeleton />
    </div>
  </div>
);

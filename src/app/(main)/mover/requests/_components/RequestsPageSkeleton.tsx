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

const LIST_SKELETON_COUNT = 3;

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

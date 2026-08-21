import { cn } from '@/lib/utils';

export interface ChatRoomListItemSkeletonProps {
  className?: string;
}

/** 채팅방 목록/미리보기 행 자리 표시 — `ChatRoomListItem`과 동일한 가로 레이아웃 */
export const ChatRoomListItemSkeleton = ({
  className,
}: ChatRoomListItemSkeletonProps) => (
  <div
    aria-hidden
    className={cn(
      'flex w-full items-center gap-3 border-b border-line-200 bg-white px-6 py-4 last:border-b-0',
      className
    )}
  >
    <div className="size-10 shrink-0 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="h-5 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-6 lg:w-28" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
      </div>
      <div className="h-4 w-full max-w-[14rem] animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-5 lg:max-w-[18rem]" />
      <div className="h-4 w-16 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-5" />
    </div>
    <div className="size-5 shrink-0 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
  </div>
);

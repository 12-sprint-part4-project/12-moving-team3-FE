import { cn } from '@/lib/utils';

export const CommunityListCardSkeleton = () => (
  <div
    className={cn(
      'flex min-h-[8.25rem] w-full overflow-hidden rounded-2xl bg-white p-3.5 shadow-request-card',
      'min-[46.5rem]:min-h-[8.75rem] min-[46.5rem]:px-5 min-[46.5rem]:py-4',
      'xl:min-h-[10rem] xl:p-6'
    )}
    aria-hidden
  >
    <div className="flex min-w-0 flex-1 flex-col pr-3 min-[46.5rem]:pr-4 xl:pr-6">
      <div className="h-5 w-16 animate-pulse rounded bg-background-200 min-[46.5rem]:h-6 min-[46.5rem]:w-20" />
      <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-background-200 min-[46.5rem]:mt-2.5 min-[46.5rem]:h-6" />
      <div className="mt-1.5 h-4 w-full animate-pulse rounded bg-background-200 min-[46.5rem]:mt-2 min-[46.5rem]:h-5" />
      <div className="mt-auto flex gap-3 pt-2 min-[46.5rem]:gap-4 min-[46.5rem]:pt-3">
        <div className="h-4 w-12 animate-pulse rounded bg-background-200" />
        <div className="h-4 w-10 animate-pulse rounded bg-background-200" />
        <div className="h-4 w-10 animate-pulse rounded bg-background-200" />
      </div>
    </div>
    <div
      className={cn(
        'size-[4.5rem] shrink-0 animate-pulse rounded-lg bg-background-200',
        'min-[46.5rem]:h-[5.5rem] min-[46.5rem]:w-[5.25rem]',
        'xl:h-[6.25rem] xl:w-[6.75rem]'
      )}
    />
  </div>
);

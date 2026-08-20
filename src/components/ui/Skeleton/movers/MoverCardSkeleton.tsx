import { cn } from '@/lib/utils';

export type MoverCardSkeletonSize = 'lg' | 'sm';

export interface MoverCardSkeletonProps {
  size?: MoverCardSkeletonSize;
  className?: string;
}

const PULSE = 'animate-pulse bg-background-200 motion-reduce:animate-none';

/** 기사님 카드 자리 표시용 스켈레톤 */
export const MoverCardSkeleton = ({
  size = 'lg',
  className = '',
}: MoverCardSkeletonProps) => {
  const isCompact = size === 'sm';

  return (
    <div
      className={cn(
        'relative flex w-full flex-col border border-line-100 bg-white shadow-request-card',
        isCompact ? 'rounded-2xl px-4 py-4' : 'rounded-2xl px-6 py-5',
        className
      )}
      aria-hidden
    >
      <div
        className={cn('flex w-full flex-col', isCompact ? 'gap-3' : 'gap-4')}
      >
        <div className="flex justify-between">
          <div className="flex flex-wrap items-center gap-2 tablet:gap-3">
            <div className={cn(PULSE, 'h-7 w-16 rounded-full')} />
            <div className={cn(PULSE, 'h-7 w-20 rounded-full')} />
            {!isCompact ? (
              <div className={cn(PULSE, 'h-7 w-14 rounded-full')} />
            ) : null}
          </div>
          {!isCompact ? (
            <div className={cn(PULSE, 'size-8 rounded-md')} />
          ) : null}
        </div>

        {!isCompact ? (
          <div className={cn(PULSE, 'h-7 w-3/4 max-w-[20rem] rounded tablet:h-8')} />
        ) : null}

        <div
          className={cn(
            'flex w-full items-start border border-line-100 bg-white',
            isCompact
              ? 'gap-3 rounded-md px-3 py-3'
              : 'gap-4 rounded-md px-[1.125rem] py-4'
          )}
        >
          <div
            className={cn(
              PULSE,
              'shrink-0 rounded-full',
              isCompact ? 'size-10' : 'size-14'
            )}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 tablet:gap-2">
            <div
              className={cn(
                PULSE,
                'rounded',
                isCompact ? 'h-5 w-28' : 'h-6 w-36'
              )}
            />
            <div className="flex flex-wrap items-center gap-3">
              <div className={cn(PULSE, 'h-4 w-24 rounded')} />
              {!isCompact ? (
                <div className={cn(PULSE, 'h-4 w-28 rounded')} />
              ) : null}
            </div>
          </div>
          <div
            className={cn(
              PULSE,
              'shrink-0 rounded-md',
              isCompact ? 'h-8 w-12' : 'h-10 w-14'
            )}
          />
        </div>
      </div>
    </div>
  );
};

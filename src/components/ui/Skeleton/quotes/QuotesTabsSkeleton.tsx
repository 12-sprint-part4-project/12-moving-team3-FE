import { cn } from '@/lib/utils';

/** 탭 바 자리 표시용 스켈레톤 */
export const QuotesTabsSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title',
      className
    )}
    aria-hidden
  >
    <div className="flex items-start gap-6 lg:gap-8">
      <div className="h-8 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-9 lg:w-32" />
      <div className="h-8 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-9 lg:w-28" />
    </div>
  </div>
);

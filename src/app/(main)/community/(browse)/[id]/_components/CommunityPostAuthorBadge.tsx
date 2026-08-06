import { cn } from '@/lib/utils';

interface CommunityPostAuthorBadgeProps {
  className?: string;
}

/** 게시글 작성자 댓글 표시 */
export const CommunityPostAuthorBadge = ({
  className = '',
}: CommunityPostAuthorBadgeProps) => (
  <span
    className={cn(
      'inline-flex h-4 shrink-0 items-center justify-center rounded px-1 text-xs-semibold whitespace-nowrap',
      'bg-blue-300/12 text-blue-300',
      'min-[46.5rem]:h-[1.125rem] min-[46.5rem]:rounded-md min-[46.5rem]:px-1.5 min-[46.5rem]:text-xs-semibold',
      className
    )}
  >
    작성자
  </span>
);

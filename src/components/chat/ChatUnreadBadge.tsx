import { cn } from '@/lib/utils';

export interface ChatUnreadBadgeProps {
  count: number;
  className?: string;
  /** icon: GNB 아이콘 우상단 / inline: 리스트 행 */
  variant?: 'icon' | 'inline';
}

const formatUnreadCount = (count: number): string => {
  if (count > 99) {
    return '99+';
  }
  return String(count);
};

/** 미읽음 숫자 뱃지 */
export const ChatUnreadBadge = ({
  count,
  className,
  variant = 'inline',
}: ChatUnreadBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  const isIcon = variant === 'icon';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-red-200 text-xs-semibold text-white',
        isIcon
          ? 'absolute -top-0.5 -right-0.5 size-[0.78125rem] p-0 text-2xs-semibold sm:-top-1 sm:size-5 sm:text-xs-semibold'
          : 'min-w-8 shrink-0 px-2.5 py-0.5 text-sm-semibold',
        className
      )}
      aria-hidden={isIcon ? true : undefined}
      aria-label={isIcon ? undefined : `미읽음 ${count}개`}
    >
      {formatUnreadCount(count)}
    </span>
  );
};

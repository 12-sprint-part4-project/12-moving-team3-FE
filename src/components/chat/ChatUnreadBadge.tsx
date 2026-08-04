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

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-red-200 text-white',
        variant === 'icon'
          ? 'absolute -top-0.5 -right-0.5 min-w-4 px-1 text-[0.625rem] leading-4 font-semibold'
          : 'min-w-5 px-1.5 py-0.5 text-xs-semibold',
        className
      )}
      aria-label={`미읽음 ${count}개`}
    >
      {formatUnreadCount(count)}
    </span>
  );
};

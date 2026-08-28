import { useTranslation } from '@/i18n/useTranslation';
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
  const { t } = useTranslation();

  if (count <= 0) {
    return null;
  }

  const isIcon = variant === 'icon';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-red-200 text-xs-semibold text-white',
        isIcon
          ? 'absolute -top-0.5 -right-0.5 size-[0.78125rem] p-0 text-2xs-semibold lg:-top-1 lg:size-5 lg:text-xs-semibold'
          : 'min-w-8 shrink-0 px-2.5 py-0.5 text-sm-semibold',
        className
      )}
      aria-hidden={isIcon ? true : undefined}
      aria-label={isIcon ? undefined : t('chat.unreadCountAria', { count })}
    >
      {formatUnreadCount(count)}
    </span>
  );
};

import { formatRelativeTime } from '@/lib/formatDate';
import { renderNotificationHighlighted } from '@/lib/notificationHighlight';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/types/notification';

export type GnbNotificationItemSize = 'sm' | 'md';

export interface GnbNotificationItemProps {
  item: NotificationItem;
  /** sm: 모바일, md: 태블릿/PC */
  size?: GnbNotificationItemSize;
  onClick?: (item: NotificationItem) => void;
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    root: 'gap-0.5 px-4 py-3',
    content: 'text-md-medium text-black-400',
    time: 'text-sm-medium text-gray-300',
  },
  md: {
    root: 'gap-0.5 px-6 py-4',
    content: 'text-lg-medium text-black-400',
    time: 'text-md-medium text-gray-300',
  },
} as const;

/** GNB 알림 드롭다운 리스트 아이템 — 본문 강조 + 상대 시간 */
export const GnbNotificationItem = ({
  item,
  size = 'md',
  onClick,
  className,
}: GnbNotificationItemProps) => {
  const styles = SIZE_STYLES[size];
  const relativeTime = formatRelativeTime(item.createdAt);

  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => onClick?.(item)}
      className={cn(
        'flex w-full cursor-pointer flex-col items-start border-b border-line-200 bg-white text-left',
        'hover:bg-background-100 focus-visible:bg-background-100 focus-visible:outline-none',
        'last:border-b-0',
        styles.root,
        className
      )}
    >
      <p className={cn('w-full break-words', styles.content)}>
        {renderNotificationHighlighted(item)}
      </p>
      {relativeTime ? (
        <p className={cn('w-full', styles.time)}>{relativeTime}</p>
      ) : null}
    </button>
  );
};

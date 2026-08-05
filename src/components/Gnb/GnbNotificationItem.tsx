import { formatRelativeTime } from '@/lib/formatDate';
import { renderNotificationHighlighted } from '@/lib/notificationHighlight';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/types/notification';

export interface GnbNotificationItemProps {
  item: NotificationItem;
  onClick?: (item: NotificationItem) => void;
  className?: string;
}

/** GNB 알림 드롭다운 리스트 아이템 — 미읽음 강조 / 읽음은 gray-300 plain */
export const GnbNotificationItem = ({
  item,
  onClick,
  className,
}: GnbNotificationItemProps) => {
  const relativeTime = formatRelativeTime(item.createdAt);
  // 읽음: 파란 강조 제거 + 시간색(gray-300)으로 읽힘 표시. 미읽음: black-400 + 강조
  const isRead = item.isRead;

  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => onClick?.(item)}
      className={cn(
        'flex w-full cursor-pointer flex-col items-start gap-0.5 border-b border-line-200 bg-white px-4 py-3 text-left last:border-b-0 md:px-6 md:py-4',
        'hover:bg-background-100 focus-visible:bg-background-100 focus-visible:outline-none',
        className
      )}
    >
      <p
        className={cn(
          'w-full break-words text-md-medium md:text-lg-medium',
          isRead ? 'text-gray-300' : 'text-black-400'
        )}
      >
        {isRead ? item.content : renderNotificationHighlighted(item)}
      </p>
      {relativeTime ? (
        <p className="w-full text-sm-medium text-gray-300 md:text-md-medium">
          {relativeTime}
        </p>
      ) : null}
    </button>
  );
};

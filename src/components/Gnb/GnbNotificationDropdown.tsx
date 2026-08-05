import CloseIcon from '@/assets/icons/close.svg';

import {
  GnbNotificationItem,
  type GnbNotificationItemSize,
} from '@/components/Gnb/GnbNotificationItem';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/types/notification';

export type GnbNotificationDropdownSize = GnbNotificationItemSize;

export interface GnbNotificationDropdownProps {
  /** sm: 모바일, md: 태블릿/PC */
  size?: GnbNotificationDropdownSize;
  items: NotificationItem[];
  isLoading?: boolean;
  onClose?: () => void;
  onItemClick?: (item: NotificationItem) => void;
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    root: 'w-[17.25rem]',
    header: 'py-3.5 pr-3 pl-4',
    title: 'text-lg-bold text-black-300',
    empty: 'px-4 py-8 text-md-medium text-gray-300',
  },
  md: {
    root: 'w-[20.4375rem]',
    header: 'py-3.5 pr-3 pl-6',
    title: 'text-2lg-bold text-black-400',
    empty: 'px-6 py-8 text-md-medium text-gray-300',
  },
} as const;

const EMPTY_MESSAGE = '새로운 알림이 없어요';
const LOADING_MESSAGE = '불러오는 중…';

/** GNB 알림 드롭다운 — 헤더·목록·empty/loading (실 API 연동은 상위 Sprint 2) */
export const GnbNotificationDropdown = ({
  size = 'md',
  items,
  isLoading = false,
  onClose,
  onItemClick,
  className,
}: GnbNotificationDropdownProps) => {
  const styles = SIZE_STYLES[size];
  const isEmpty = !isLoading && items.length === 0;

  return (
    <div
      role="menu"
      aria-label="알림"
      className={cn(
        'flex max-w-[100vw] flex-col items-stretch rounded-3xl border border-line-200 bg-white px-4 py-2.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20',
        styles.root,
        className
      )}
    >
      <div
        className={cn(
          'flex w-full shrink-0 items-center justify-between',
          styles.header
        )}
      >
        <p className={styles.title}>알림</p>
        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center text-black-400"
        >
          <CloseIcon className="size-6" aria-hidden />
        </button>
      </div>

      <div className="flex w-full flex-col items-stretch">
        {isLoading ? (
          <p className={cn('text-center', styles.empty)}>{LOADING_MESSAGE}</p>
        ) : null}

        {isEmpty ? (
          <p className={cn('text-center', styles.empty)}>{EMPTY_MESSAGE}</p>
        ) : null}

        {!isLoading
          ? items.map((item) => (
              <GnbNotificationItem
                key={item.id}
                item={item}
                size={size}
                onClick={onItemClick}
              />
            ))
          : null}
      </div>
    </div>
  );
};

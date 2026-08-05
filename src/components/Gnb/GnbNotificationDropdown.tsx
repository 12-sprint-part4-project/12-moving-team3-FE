import CloseIcon from '@/assets/icons/close.svg';

import { GnbNotificationItem } from '@/components/Gnb/GnbNotificationItem';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/types/notification';

export interface GnbNotificationDropdownProps {
  items: NotificationItem[];
  isLoading?: boolean;
  onClose?: () => void;
  onItemClick?: (item: NotificationItem) => void;
  className?: string;
}

const EMPTY_MESSAGE = '새로운 알림이 없어요';
const LOADING_MESSAGE = '불러오는 중…';

/** GNB 알림 드롭다운 — 헤더·목록·empty/loading (실 API 연동은 상위 Sprint 2) */
export const GnbNotificationDropdown = ({
  items,
  isLoading = false,
  onClose,
  onItemClick,
  className,
}: GnbNotificationDropdownProps) => {
  const isEmpty = !isLoading && items.length === 0;

  return (
    <div
      role="menu"
      aria-label="알림"
      className={cn(
        'flex w-[19.5rem] max-w-[100vw] flex-col items-stretch rounded-3xl border border-line-200 bg-white px-4 py-2.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20 md:w-[22.5rem]',
        className
      )}
    >
      <div className="flex w-full shrink-0 items-center justify-between py-3.5 pr-3 pl-4 md:pl-6">
        <p className="text-lg-bold text-black-300 md:text-2lg-bold md:text-black-400">
          알림
        </p>
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
          <Spinner message={LOADING_MESSAGE} className="gap-3 py-8" />
        ) : null}

        {isEmpty ? (
          <p className="px-4 py-8 text-center text-md-medium text-gray-300 md:px-6">
            {EMPTY_MESSAGE}
          </p>
        ) : null}

        {!isLoading
          ? items.map((item) => (
              <GnbNotificationItem
                key={item.id}
                item={item}
                onClick={onItemClick}
              />
            ))
          : null}
      </div>
    </div>
  );
};

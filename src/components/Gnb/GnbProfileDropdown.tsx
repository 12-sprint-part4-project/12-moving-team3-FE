'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';

import {
  GNB_PROFILE_MENU_BY_ROLE,
  type GnbNavItem,
} from '@/components/Gnb/gnbNav';
import { cn } from '@/lib/utils';

export type GnbProfileDropdownSize = 'sm' | 'md';

export interface GnbProfileDropdownProps {
  /** sm: 모바일, md: 태블릿/PC */
  size?: GnbProfileDropdownSize;
  userName?: string;
  nameSuffix?: string;
  menuItems?: GnbNavItem[];
  /** 메뉴 링크 클릭 시 (드롭다운 닫기용) */
  onClose?: () => void;
  onLogout?: () => void;
  className?: string;
}

const DEFAULT_MENU_ITEMS: GnbNavItem[] = [
  ...GNB_PROFILE_MENU_BY_ROLE.customer,
];

const SIZE_STYLES = {
  sm: {
    root: 'w-[8.75rem] px-1.5 pt-2.5 pb-1.5',
    name: 'px-3 py-2 text-lg-bold text-black-400',
    item: 'px-3 py-2 text-md-medium text-black-400',
    lastItem: 'px-3 pt-2 pb-4 text-md-medium text-black-400',
    logout: 'px-3 pt-3 pb-2 text-xs-regular text-gray-500',
  },
  md: {
    root: 'w-[15rem] px-1 pt-4 pb-1.5',
    name: 'py-3.5 pr-3 pl-6 text-2lg-bold text-black-300',
    item: 'py-3.5 pr-3 pl-6 text-lg-medium text-black-400',
    lastItem: 'pt-3.5 pr-3 pb-6 pl-6 text-lg-medium text-black-400',
    logout: 'px-3 pt-3.5 pb-2 text-md-medium text-gray-500',
  },
} as const;

const DISPLAY_NAME_MAX_LENGTH: Record<GnbProfileDropdownSize, number> = {
  sm: 3,
  md: 7,
};

/** 닉네임 maxLength 초과 시 말줄임표 */
const truncateDisplayName = (name: string, maxLength: number): string =>
  name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;

/** GNB 프로필 드롭다운 메뉴 */
export const GnbProfileDropdown = ({
  size = 'md',
  userName = '',
  nameSuffix = '',
  menuItems = DEFAULT_MENU_ITEMS,
  onClose,
  onLogout,
  className,
}: GnbProfileDropdownProps) => {
  const { t } = useTranslation();
  const styles = SIZE_STYLES[size];
  const lastIndex = menuItems.length - 1;
  const truncatedUserName = truncateDisplayName(
    userName,
    DISPLAY_NAME_MAX_LENGTH[size]
  );
  const displayName = [truncatedUserName, nameSuffix].filter(Boolean).join(' ');
  const fullDisplayName = [userName, nameSuffix].filter(Boolean).join(' ');

  return (
    <div
      role="menu"
      aria-label={t('nav.profile.menu')}
      className={cn(
        'flex flex-col items-stretch rounded-2xl border border-line-200 bg-white shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20',
        styles.root,
        className
      )}
    >
      <p
        title={fullDisplayName !== displayName ? fullDisplayName : undefined}
        className={cn('shrink-0 whitespace-nowrap', styles.name)}
      >
        {displayName}
      </p>

      <nav
        className="flex flex-col items-stretch"
        aria-label={t('nav.profile.menuLinks')}
      >
        {menuItems.map((item, index) => {
          const isLast = index === lastIndex;

          return (
            <Link
              key={item.href + item.labelKey}
              href={item.href}
              role="menuitem"
              onClick={onClose}
              className={cn(
                'flex w-full items-center whitespace-nowrap',
                isLast ? styles.lastItem : styles.item
              )}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="flex w-full shrink-0 items-center justify-center border-t border-line-100">
        <button
          type="button"
          role="menuitem"
          onClick={onLogout}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center whitespace-nowrap',
            styles.logout
          )}
        >
          {t('common.logout')}
        </button>
      </div>
    </div>
  );
};

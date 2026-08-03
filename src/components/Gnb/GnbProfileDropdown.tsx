import Link from 'next/link';

import type { GnbNavItem } from '@/components/Gnb/gnbNav';
import { cn } from '@/lib/utils';

export type GnbProfileDropdownSize = 'sm' | 'md';

export interface GnbProfileDropdownProps {
  /** sm: 모바일, md: 태블릿/PC */
  size?: GnbProfileDropdownSize;
  userName?: string;
  nameSuffix?: string;
  menuItems?: GnbNavItem[];
  onLogout?: () => void;
  className?: string;
}

const DEFAULT_MENU_ITEMS: GnbNavItem[] = [
  { label: '프로필 수정', href: '/profile/customer/edit' },
  { label: '찜한 기사님', href: '/favorites' },
  { label: '이사 리뷰', href: '/reviews' },
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

/** GNB 프로필 드롭다운 메뉴 */
export const GnbProfileDropdown = ({
  size = 'md',
  userName = '',
  nameSuffix = '',
  menuItems = DEFAULT_MENU_ITEMS,
  onLogout,
  className,
}: GnbProfileDropdownProps) => {
  const styles = SIZE_STYLES[size];
  const lastIndex = menuItems.length - 1;
  const displayName = [userName, nameSuffix].filter(Boolean).join(' ');

  return (
    <div
      role="menu"
      aria-label="프로필 메뉴"
      className={cn(
        'flex flex-col items-stretch rounded-2xl border border-line-200 bg-white shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20',
        styles.root,
        className
      )}
    >
      <p className={cn('shrink-0 whitespace-nowrap', styles.name)}>
        {displayName}
      </p>

      <nav
        className="flex flex-col items-stretch"
        aria-label="프로필 메뉴 링크"
      >
        {menuItems.map((item, index) => {
          const isLast = index === lastIndex;

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              role="menuitem"
              className={cn(
                'flex w-full items-center whitespace-nowrap',
                isLast ? styles.lastItem : styles.item
              )}
            >
              {item.label}
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
          로그아웃
        </button>
      </div>
    </div>
  );
};

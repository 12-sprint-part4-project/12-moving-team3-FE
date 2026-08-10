'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CloseIcon from '@/assets/icons/close.svg';

import {
  GNB_NAV_BY_ROLE,
  isGnbNavActive,
  type GnbNavItem,
  type GnbNavRole,
} from '@/components/Gnb/gnbNav';
import { cn } from '@/lib/utils';

export type GnbMenuType = GnbNavRole;

export interface GnbMenuProps {
  /** Figma type — customer=일반 유저, mover=기사님 */
  type?: GnbMenuType;
  /** 메뉴 링크. 미지정 시 type 기본값 사용 */
  navItems?: GnbNavItem[];
  onClose?: () => void;
  onLogout?: () => void;
  className?: string;
}

/**
 * 모바일/태블릿 GNB 사이드 메뉴.
 * Figma "gnb_menu" — type=일반 유저 | 기사님.
 */
export const GnbMenu = ({
  type = 'customer',
  navItems,
  onClose,
  onLogout,
  className = '',
}: GnbMenuProps) => {
  const pathname = usePathname();
  const items: GnbNavItem[] = navItems ?? [...GNB_NAV_BY_ROLE[type]];

  const handleLogout = () => {
    onLogout?.();
    onClose?.();
  };

  return (
    <aside
      className={`flex h-full w-[13.75rem] flex-col bg-white ${className}`}
      aria-label="메뉴"
    >
      <div className="flex h-[3.375rem] w-full shrink-0 items-center justify-end border-b border-line-100 bg-white px-4 py-2.5">
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="inline-flex size-6 shrink-0 items-center justify-center text-black-100"
        >
          <CloseIcon className="size-6" aria-hidden />
        </button>
      </div>

      <nav className="flex flex-col items-stretch">
        {items.map((item) => {
          const isActive = isGnbNavActive(pathname, item.href);

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full items-center overflow-hidden bg-white px-5 py-6 text-lg-medium whitespace-nowrap',
                isActive ? 'text-black-400' : 'text-gray-400'
              )}
            >
              {item.label}
            </Link>
          );
        })}
        {onLogout ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center overflow-hidden bg-white px-5 py-6 text-left text-lg-medium whitespace-nowrap text-black-400"
          >
            로그아웃
          </button>
        ) : null}
      </nav>
    </aside>
  );
};

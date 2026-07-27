'use client';

import { useState } from 'react';

import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbMenu } from '@/components/Gnb/GnbMenu';
import type { GnbNavItem } from '@/components/Gnb/gnbNav';

const LANDING_MENU_ITEMS: GnbNavItem[] = [
  { label: '기사님 찾기', href: '/movers' },
  { label: '로그인', href: '/login' },
];

/**
 * 공통 헤더.
 * 랜딩 GNB + sm/md 사이드 메뉴.
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="md:hidden">
        <GnbLanding size="sm" onMenuClick={handleMenuOpen} />
      </div>
      <div className="hidden md:block lg:hidden">
        <GnbLanding size="md" onMenuClick={handleMenuOpen} />
      </div>
      <div className="hidden lg:block">
        <GnbLanding size="lg" />
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="absolute inset-0 bg-black-500/40"
            onClick={handleMenuClose}
          />
          <div className="absolute inset-y-0 right-0 h-full">
            <GnbMenu navItems={LANDING_MENU_ITEMS} onClose={handleMenuClose} />
          </div>
        </div>
      ) : null}
    </>
  );
};

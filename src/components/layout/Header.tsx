'use client';

import { useState } from 'react';

import { GnbDefault } from '@/components/Gnb/GnbDefault';
import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbMenu } from '@/components/Gnb/GnbMenu';
import type { GnbNavItem } from '@/components/Gnb/gnbNav';
import { useAuth } from '@/hooks/useAuth';

const LANDING_MENU_ITEMS: GnbNavItem[] = [
  { label: '기사님 찾기', href: '/movers' },
  { label: '로그인', href: '/login' },
];

/** 비로그인: GnbLanding / 로그인: GnbDefault */
export const Header = () => {
  const { user, isReady } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  if (!isReady) return null;

  if (!user) {
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
  }

  const navRole = user.userType === 'MOVER' ? 'mover' : 'customer';
  const desktopMenu = navRole === 'mover' ? 'twoMenu' : 'threeMenu';

  return (
    <>
      <div className="md:hidden">
        <GnbDefault
          size="sm"
          menu="iconProfile"
          userName={user.nickname}
          onMenuClick={handleMenuOpen}
        />
      </div>
      <div className="hidden md:block lg:hidden">
        <GnbDefault
          size="md"
          menu="iconProfile"
          userName={user.nickname}
          onMenuClick={handleMenuOpen}
        />
      </div>
      <div className="hidden lg:block">
        <GnbDefault
          size="lg"
          menu={desktopMenu}
          userName={user.nickname}
        />
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
            <GnbMenu type={navRole} onClose={handleMenuClose} />
          </div>
        </div>
      ) : null}
    </>
  );
};

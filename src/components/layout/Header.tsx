'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { GnbDefault } from '@/components/Gnb/GnbDefault';
import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbMenu } from '@/components/Gnb/GnbMenu';
import type { GnbNavItem } from '@/components/Gnb/gnbNav';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { logout } from '@/services/authApi';

const LANDING_MENU_ITEMS: GnbNavItem[] = [
  { label: '기사님 찾기', href: '/movers' },
  { label: '로그인', href: '/login' },
];

/** 비로그인: GnbLanding / 로그인: GnbDefault */
export const Header = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isReady, clearSession } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 프로필 미등록(404) 고객은 조회를 건너뛴다 — Header 아바타용
  const { data: customerProfile } = useCustomerProfile(
    Boolean(
      isReady &&
        user?.userType === 'CUSTOMER' &&
        user.isProfileCompleted
    )
  );

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast({ content: message });
      return;
    }

    clearSession();
    showToast({ content: '로그아웃되었습니다.' });
    router.replace('/');
  };

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
              <GnbMenu
                navItems={LANDING_MENU_ITEMS}
                onClose={handleMenuClose}
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }

  const navRole = user.userType === 'MOVER' ? 'mover' : 'customer';
  const desktopMenu = navRole === 'mover' ? 'twoMenu' : 'threeMenu';
  const avatarSrc = customerProfile?.profileImageUrl ?? null;

  return (
    <>
      <div className="md:hidden">
        <GnbDefault
          size="sm"
          menu="iconProfile"
          userName={user.nickname}
          avatarSrc={avatarSrc}
          onMenuClick={handleMenuOpen}
        />
      </div>
      <div className="hidden md:block lg:hidden">
        <GnbDefault
          size="md"
          menu="iconProfile"
          userName={user.nickname}
          avatarSrc={avatarSrc}
          onMenuClick={handleMenuOpen}
        />
      </div>
      <div className="hidden lg:block">
        <GnbDefault
          size="lg"
          menu={desktopMenu}
          userName={user.nickname}
          avatarSrc={avatarSrc}
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
            <GnbMenu
              type={navRole}
              onClose={handleMenuClose}
              onLogout={handleLogout}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

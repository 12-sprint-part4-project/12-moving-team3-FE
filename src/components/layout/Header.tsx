'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { GnbDefault } from '@/components/Gnb/GnbDefault';
import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbMenu } from '@/components/Gnb/GnbMenu';
import { getGnbProfileMenuItems, type GnbNavItem } from '@/components/Gnb/gnbNav';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useMoverProfile } from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthRouteRequirement } from '@/lib/authRoutePaths';
import { logout } from '@/services/authApi';

const LANDING_MENU_ITEMS: GnbNavItem[] = [
  { label: '기사님 찾기', href: '/movers' },
  { label: '커뮤니티', href: '/community' },
  { label: '로그인', href: '/login' },
];

/** 비로그인: GnbLanding / 로그인: GnbDefault */
export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user, isReady, clearSession } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCustomerProfileReady = Boolean(
    isReady && user?.userType === 'CUSTOMER' && user.isProfileCompleted
  );
  const isMoverProfileReady = Boolean(
    isReady && user?.userType === 'MOVER' && user.isProfileCompleted
  );
  // 프로필 미등록(404)은 조회를 건너뛴다 — Header 아바타용
  const { data: customerProfile } = useCustomerProfile(isCustomerProfileReady);
  const { data: moverProfile } = useMoverProfile(isMoverProfileReady);

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

    queryClient.clear();
    clearSession();
    showToast({ content: '로그아웃되었습니다.' });

    // 공개 경로는 유지, 로그인 필요 경로(/favorites, /chat 등)는 랜딩으로
    if (getAuthRouteRequirement(pathname).kind !== 'public') {
      router.replace('/');
    }
  };

  if (!isReady) return null;

  if (!user) {
    return (
      <>
        <div className="min-[46.5rem]:hidden">
          <GnbLanding size="sm" onMenuClick={handleMenuOpen} />
        </div>
        <div className="hidden min-[46.5rem]:block lg:hidden">
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
  const nameSuffix = navRole === 'mover' ? '기사님' : '고객님';
  const avatarSrc =
    navRole === 'mover'
      ? (moverProfile?.profileImageUrl ?? null)
      : (customerProfile?.profileImageUrl ?? null);
  const profileMenuItems = getGnbProfileMenuItems(
    navRole,
    user.isProfileCompleted
  );

  return (
    <>
      <div className="min-[46.5rem]:hidden">
        <GnbDefault
          size="sm"
          menu="iconProfile"
          userName={user.nickname}
          nameSuffix={nameSuffix}
          avatarSrc={avatarSrc}
          profileMenuItems={profileMenuItems}
          notificationRole={navRole}
          onMenuClick={handleMenuOpen}
          onLogout={handleLogout}
        />
      </div>
      <div className="hidden min-[46.5rem]:block lg:hidden">
        <GnbDefault
          size="md"
          menu="iconProfile"
          userName={user.nickname}
          nameSuffix={nameSuffix}
          avatarSrc={avatarSrc}
          profileMenuItems={profileMenuItems}
          notificationRole={navRole}
          onMenuClick={handleMenuOpen}
          onLogout={handleLogout}
        />
      </div>
      <div className="hidden lg:block">
        <GnbDefault
          size="lg"
          menu={desktopMenu}
          userName={user.nickname}
          nameSuffix={nameSuffix}
          avatarSrc={avatarSrc}
          profileMenuItems={profileMenuItems}
          notificationRole={navRole}
          onLogout={handleLogout}
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

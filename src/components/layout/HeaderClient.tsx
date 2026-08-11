'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { GnbDefault } from '@/components/Gnb/GnbDefault';
import { GnbMenu } from '@/components/Gnb/GnbMenu';
import { getGnbProfileMenuItems, type GnbNavItem } from '@/components/Gnb/gnbNav';
import { GuestHeaderMenuProvider } from '@/components/layout/GuestHeaderMenuContext';
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

export interface HeaderClientProps {
  /** Server에서 조립한 비로그인 GNB (sm) */
  landingSm: ReactNode;
  /** Server에서 조립한 비로그인 GNB (md) */
  landingMd: ReactNode;
  /** Server에서 조립한 비로그인 GNB (lg) */
  landingLg: ReactNode;
}

/**
 * 인증·메뉴 상태만 담당하는 Client 경계.
 * 비로그인 UI는 Server Header가 넘긴 GnbLanding 슬롯을 그대로 렌더한다.
 * hydration 전(isReady=false)에도 랜딩 GNB를 그려 헤더 깜빡임을 막는다.
 */
export const HeaderClient = ({
  landingSm,
  landingMd,
  landingLg,
}: HeaderClientProps) => {
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

    if (getAuthRouteRequirement(pathname).kind !== 'public') {
      router.replace('/');
    }
  };

  /**
   * isReady 전·비로그인은 Server에서 조립한 랜딩 GNB를 즉시 렌더한다.
   * (이전: isReady 전 null → 새로고침 시 헤더가 늦게 뜨는 원인)
   */
  if (!isReady || !user) {
    return (
      <GuestHeaderMenuProvider openMenu={handleMenuOpen}>
        <div className="min-[46.5rem]:hidden">{landingSm}</div>
        <div className="hidden min-[46.5rem]:block lg:hidden">{landingMd}</div>
        <div className="hidden lg:block">{landingLg}</div>

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
      </GuestHeaderMenuProvider>
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

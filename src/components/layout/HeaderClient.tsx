'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

import { GnbDefault } from '@/components/Gnb/GnbDefault';
import { GnbMenuOverlay } from '@/components/Gnb/GnbMenuOverlay';
import {
  getGnbProfileMenuItems,
  type GnbNavItem,
} from '@/components/Gnb/gnbNav';
import { GuestHeaderMenuProvider } from '@/components/layout/GuestHeaderMenuContext';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useMoverProfile } from '@/hooks/useMoverProfile';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { suppressLoginGate, releaseLoginGate } from '@/lib/authLoginGate';
import { getAuthRouteRequirement } from '@/lib/authRoutePaths';
import { isSuspendedPagePath } from '@/lib/memberOnlyPaths';
import { logout } from '@/services/authApi';

const LANDING_MENU_ITEMS: GnbNavItem[] = [
  { labelKey: 'nav.findMovers', href: '/movers' },
  { labelKey: 'nav.community', href: '/community' },
  { labelKey: 'common.login', href: '/login' },
];

const HeaderSkeleton = () => (
  <div
    className="h-[3.375rem] border-b border-line-100 bg-white lg:h-[5.5rem]"
    aria-hidden
  />
);

export interface HeaderClientProps {
  landingSm: ReactNode;
  landingMd: ReactNode;
  landingLg: ReactNode;
}

export const HeaderClient = ({
  landingSm,
  landingMd,
  landingLg,
}: HeaderClientProps) => {
  const { t } = useTranslation();
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
          : t('auth.logout.unexpected');
      showToast({ content: message });
      return;
    }

    queryClient.clear();
    const shouldLeaveAfterLogout =
      getAuthRouteRequirement(pathname).kind !== 'public' ||
      isSuspendedPagePath(pathname);

    if (shouldLeaveAfterLogout) {
      suppressLoginGate();
    }

    clearSession();
    showToast({ content: t('auth.logout.success') });

    if (shouldLeaveAfterLogout) {
      router.replace('/');
    } else {
      releaseLoginGate();
    }
  };

  if (!isReady) {
    return <HeaderSkeleton />;
  }

  if (!user) {
    return (
      <GuestHeaderMenuProvider openMenu={handleMenuOpen}>
        <div className="min-[46.5rem]:hidden">{landingSm}</div>
        <div className="hidden min-[46.5rem]:block lg:hidden">{landingMd}</div>
        <div className="hidden lg:block">{landingLg}</div>

        <GnbMenuOverlay
          isOpen={isMenuOpen}
          navItems={LANDING_MENU_ITEMS}
          onClose={handleMenuClose}
        />
      </GuestHeaderMenuProvider>
    );
  }

  const navRole = user.userType === 'MOVER' ? 'mover' : 'customer';
  const desktopMenu = navRole === 'mover' ? 'twoMenu' : 'threeMenu';
  const nameSuffix =
    navRole === 'mover' ? t('gnb.role.mover') : t('gnb.role.customer');
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

      <GnbMenuOverlay
        isOpen={isMenuOpen}
        type={navRole}
        onClose={handleMenuClose}
        onLogout={handleLogout}
      />
    </>
  );
};

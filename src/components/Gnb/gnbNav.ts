export interface GnbNavItem {
  labelKey: string;
  href: string;
}

/** pathname이 GNB 메뉴 href와 일치하는지 (하위 경로 포함) */
export const isGnbNavActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

/** 기사님(mover) / 일반 유저(customer) GNB 네비 항목 */
export const GNB_NAV_BY_ROLE = {
  mover: [
    { labelKey: 'nav.receivedRequests', href: '/mover/requests' },
    { labelKey: 'nav.myQuotes', href: '/mover/quotes' },
    { labelKey: 'nav.community', href: '/community' },
  ],
  customer: [
    { labelKey: 'nav.estimateRequest', href: '/estimates/request' },
    { labelKey: 'nav.findMovers', href: '/movers' },
    { labelKey: 'nav.myQuotes', href: '/quotes' },
    { labelKey: 'nav.community', href: '/community' },
  ],
} as const satisfies Record<string, GnbNavItem[]>;

/**
 * 프로필 드롭다운 메뉴.
 * customer: 프로필 수정 · 찜한 기사님 · 이사 리뷰 · 이용 내역
 * mover: 마이페이지 · 받은 견적 (Figma dropdown 1:5636)
 */
export const GNB_PROFILE_MENU_BY_ROLE = {
  mover: [
    { labelKey: 'nav.profile.mypage', href: '/mover/mypage' },
    { labelKey: 'nav.profile.sentQuotes', href: '/mover/quotes' },
  ],
  customer: [
    { labelKey: 'nav.profile.edit', href: '/profile/customer/edit' },
    { labelKey: 'nav.profile.favorites', href: '/favorites' },
    { labelKey: 'nav.profile.reviews', href: '/reviews' },
    { labelKey: 'nav.profile.history', href: '/quotes/history' },
  ],
} as const satisfies Record<string, GnbNavItem[]>;

export type GnbNavRole = keyof typeof GNB_NAV_BY_ROLE;

/**
 * 프로필 미완료 시 첫 메뉴를 '프로필 등록'으로 교체한다.
 * - customer: 프로필 수정 → /profile/customer
 * - mover: 마이페이지 → /profile/mover
 */
export const getGnbProfileMenuItems = (
  role: GnbNavRole,
  isProfileCompleted: boolean
): GnbNavItem[] => {
  const items: GnbNavItem[] = [...GNB_PROFILE_MENU_BY_ROLE[role]];

  if (isProfileCompleted) {
    return items;
  }

  if (role === 'customer') {
    return items.map((item) =>
      item.href === '/profile/customer/edit'
        ? { labelKey: 'nav.profile.register', href: '/profile/customer' }
        : item
    );
  }

  return items.map((item) =>
    item.href === '/mover/mypage'
      ? { labelKey: 'nav.profile.register', href: '/profile/mover' }
      : item
  );
};

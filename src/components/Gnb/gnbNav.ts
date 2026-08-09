export interface GnbNavItem {
  label: string;
  href: string;
}

/** 기사님(mover) / 일반 유저(customer) GNB 네비 항목 */
export const GNB_NAV_BY_ROLE = {
  mover: [
    { label: '받은 요청', href: '/mover/requests' },
    { label: '내 견적 관리', href: '/mover/quotes' },
    { label: '커뮤니티', href: '/community' },
  ],
  customer: [
    { label: '견적 요청', href: '/estimates/request' },
    { label: '기사님 찾기', href: '/movers' },
    { label: '내 견적 관리', href: '/quotes' },
    { label: '커뮤니티', href: '/community' },
  ],
} as const satisfies Record<string, GnbNavItem[]>;

/**
 * 프로필 드롭다운 메뉴.
 * customer: 프로필 수정 · 찜한 기사님 · 이사 리뷰 · 이용 내역
 * mover: 마이페이지 · 받은 견적 (Figma dropdown 1:5636)
 */
export const GNB_PROFILE_MENU_BY_ROLE = {
  mover: [
    { label: '마이페이지', href: '/mover/mypage' },
    { label: '보낸 견적', href: '/mover/quotes' },
  ],
  customer: [
    { label: '프로필 수정', href: '/profile/customer/edit' },
    { label: '찜한 기사님', href: '/favorites' },
    { label: '이사 리뷰', href: '/reviews' },
    { label: '이용 내역', href: '/quotes/history' },
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
        ? { label: '프로필 등록', href: '/profile/customer' }
        : item
    );
  }

  return items.map((item) =>
    item.href === '/mover/mypage'
      ? { label: '프로필 등록', href: '/profile/mover' }
      : item
  );
};

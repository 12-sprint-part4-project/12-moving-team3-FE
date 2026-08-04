export interface GnbNavItem {
  label: string;
  href: string;
}

/** 기사님(mover) / 일반 유저(customer) GNB 네비 항목 */
export const GNB_NAV_BY_ROLE = {
  mover: [
    { label: '받은 요청', href: '/mover/requests' },
    { label: '내 견적 관리', href: '/mover/quotes' },
  ],
  customer: [
    { label: '견적 요청', href: '/estimates/request' },
    { label: '기사님 찾기', href: '/movers' },
    { label: '내 견적 관리', href: '/quotes' },
  ],
} as const satisfies Record<string, GnbNavItem[]>;

/**
 * 프로필 드롭다운 메뉴.
 * customer: 프로필 수정 · 찜한 기사님 · 이사 리뷰 (Figma 1:5648)
 * mover: 마이페이지 · 받은 견적 (Figma dropdown 1:5636)
 */
export const GNB_PROFILE_MENU_BY_ROLE = {
  mover: [
    { label: '마이페이지', href: '/mover/mypage' },
    { label: '받은 견적', href: '/mover/quotes' },
  ],
  customer: [
    { label: '프로필 수정', href: '/profile/customer/edit' },
    { label: '찜한 기사님', href: '/favorites' },
    { label: '이사 리뷰', href: '/reviews' },
  ],
} as const satisfies Record<string, GnbNavItem[]>;

export type GnbNavRole = keyof typeof GNB_NAV_BY_ROLE;

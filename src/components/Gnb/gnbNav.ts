export interface GnbNavItem {
  label: string;
  href: string;
}

/** 기사님(mover) / 일반 유저(customer) GNB 네비 항목 */
export const GNB_NAV_BY_ROLE = {
  mover: [
    { label: '받은 요청', href: '/requests' },
    { label: '내 견적 관리', href: '/estimates' },
  ],
  customer: [
    { label: '견적 요청', href: '/estimates/request' },
    { label: '기사님 찾기', href: '/movers' },
    { label: '내 견적 관리', href: '/estimates' },
  ],
} as const satisfies Record<string, GnbNavItem[]>;

export type GnbNavRole = keyof typeof GNB_NAV_BY_ROLE;

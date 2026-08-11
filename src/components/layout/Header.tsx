import { Suspense, type ReactNode } from 'react';

import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbLandingLoginButton } from '@/components/Gnb/GnbLandingLoginButton';
import { GnbLandingMenuButton } from '@/components/Gnb/GnbLandingMenuButton';
import { HeaderClient } from '@/components/layout/HeaderClient';
import { getServerAuthUiUser } from '@/lib/getServerAuthUiUser';
import type { AuthUiUser } from '@/lib/authUiCookie';

const landingSm = (
  <GnbLanding size="sm" menuSlot={<GnbLandingMenuButton />} />
);
const landingMd = (
  <GnbLanding size="md" menuSlot={<GnbLandingMenuButton />} />
);
const landingLg = (
  <GnbLanding size="lg" loginButton={<GnbLandingLoginButton />} />
);

interface HeaderTreeProps {
  initialUser: AuthUiUser | null;
}

const HeaderTree = ({ initialUser }: HeaderTreeProps) => (
  <HeaderClient
    initialUser={initialUser}
    landingSm={landingSm}
    landingMd={landingMd}
    landingLg={landingLg}
  />
);

/** cookies()는 레이아웃을 막지 않도록 Suspense 안에서만 읽는다. */
const HeaderFromCookie = async () => {
  const initialUser = await getServerAuthUiUser();
  return <HeaderTree initialUser={initialUser} />;
};

/** 쿠키 대기 중 — 잘못된 로그인/비로그인 UI 대신 높이만 맞춤 */
const HeaderFallback = () => (
  <div
    className="h-[3.375rem] border-b border-line-100 bg-white lg:h-[5.5rem]"
    aria-hidden
  />
);

/**
 * 루트 헤더 (Server Component).
 * UI 쿠키로 SSR 로그인 상태를 맞추되, cookies()는 Suspense 경계 안에서만 사용한다.
 */
export const Header = (): ReactNode => (
  <Suspense fallback={<HeaderFallback />}>
    <HeaderFromCookie />
  </Suspense>
);

import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbLandingLoginButton } from '@/components/Gnb/GnbLandingLoginButton';
import { GnbLandingMenuButton } from '@/components/Gnb/GnbLandingMenuButton';
import { HeaderClient } from '@/components/layout/HeaderClient';

/** 루트 헤더 (Server Component). 로그인 버튼만 Client로 주입한다. */
export const Header = () => (
  <HeaderClient
    landingSm={
      <GnbLanding size="sm" menuSlot={<GnbLandingMenuButton />} />
    }
    landingMd={
      <GnbLanding size="md" menuSlot={<GnbLandingMenuButton />} />
    }
    landingLg={
      <GnbLanding size="lg" loginButton={<GnbLandingLoginButton />} />
    }
  />
);

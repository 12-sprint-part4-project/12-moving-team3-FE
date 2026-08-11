import type { ReactNode } from 'react';

import { GnbLanding } from '@/components/Gnb/GnbLanding';
import { GnbLandingLoginButton } from '@/components/Gnb/GnbLandingLoginButton';
import { GnbLandingMenuButton } from '@/components/Gnb/GnbLandingMenuButton';
import { HeaderClient } from '@/components/layout/HeaderClient';

const landingSm = (
  <GnbLanding size="sm" menuSlot={<GnbLandingMenuButton />} />
);
const landingMd = (
  <GnbLanding size="md" menuSlot={<GnbLandingMenuButton />} />
);
const landingLg = (
  <GnbLanding size="lg" loginButton={<GnbLandingLoginButton />} />
);

export const Header = (): ReactNode => (
  <HeaderClient
    landingSm={landingSm}
    landingMd={landingMd}
    landingLg={landingLg}
  />
);

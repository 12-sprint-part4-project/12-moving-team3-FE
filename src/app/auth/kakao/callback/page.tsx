import { Suspense } from 'react';

import { KakaoCallbackClient } from '@/app/auth/kakao/callback/_components/KakaoCallbackClient';

/**
 * 카카오 OAuth Redirect URI.
 * /auth/kakao/callback?code=...&state=CUSTOMER|MOVER
 */
const KakaoCallbackPage = () => {
  return (
    <Suspense fallback={<section className="min-h-full w-full bg-white" />}>
      <KakaoCallbackClient />
    </Suspense>
  );
};

export default KakaoCallbackPage;

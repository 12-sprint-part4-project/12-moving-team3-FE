import { Suspense } from 'react';

import { KakaoCallbackClient } from '@/app/auth/kakao/callback/_components/KakaoCallbackClient';

const CallbackFallback = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center bg-white px-6 py-16">
      <p className="text-md-regular text-black-400 lg:text-xl-regular">
        카카오 로그인 처리 중...
      </p>
    </section>
  );
};

/**
 * 카카오 OAuth Redirect URI.
 * /auth/kakao/callback?code=...&state=CUSTOMER|MOVER
 */
const KakaoCallbackPage = () => {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <KakaoCallbackClient />
    </Suspense>
  );
};

export default KakaoCallbackPage;

import { Suspense } from 'react';

import { KakaoCallbackClient } from './_components/KakaoCallbackClient';

/** useSearchParams용 Suspense 경계 */
const KakaoCallbackPage = () => {
  return (
    <Suspense fallback={<section className="min-h-full w-full bg-white" />}>
      <KakaoCallbackClient />
    </Suspense>
  );
};

export default KakaoCallbackPage;

import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';

import MoverRequestsPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '받은 요청',
};

/**
 * 기사님 받은 요청 페이지.
 */
const MoverRequestsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full w-full items-center justify-center bg-white">
          <Spinner message="목록 불러오는 중..." />
        </div>
      }
    >
      <MoverRequestsPageClient />
    </Suspense>
  );
};

export default MoverRequestsPage;

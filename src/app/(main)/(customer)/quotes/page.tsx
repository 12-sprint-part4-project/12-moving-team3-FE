import { Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import CustomerQuotesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 견적 관리',
};

/**
 * 고객 내 견적 관리 페이지 (대기 중인 견적)
 */
const CustomerQuotesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full w-full items-center justify-center bg-background-200">
          <Spinner message="목록 불러오는 중..." />
        </div>
      }
    >
      <CustomerQuotesPageClient />
    </Suspense>
  );
};

export default CustomerQuotesPage;

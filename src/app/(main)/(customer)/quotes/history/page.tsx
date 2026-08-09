import { Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import CustomerQuoteHistoryPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용 내역',
};

/**
 * 고객 이용 내역 페이지 (확정한 견적)
 */
const CustomerQuoteHistoryPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full w-full items-center justify-center bg-background-200">
          <Spinner message="목록 불러오는 중..." />
        </div>
      }
    >
      <CustomerQuoteHistoryPageClient />
    </Suspense>
  );
};

export default CustomerQuoteHistoryPage;

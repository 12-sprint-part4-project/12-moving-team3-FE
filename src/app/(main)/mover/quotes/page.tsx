import { Suspense } from 'react';

import { QuotesPageContentSkeleton } from '@/components/quotes/QuotesPageSkeleton';
import { resolveQuotesTabParam } from '@/components/quotes/QuotesTabsShell';

import {
  MOVER_QUOTES_PAGE_X_PADDING,
  MoverQuotesTabs,
  parseMoverQuotesTabId,
} from './_components/MoverQuotesTabs';
import MoverQuotesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 견적 관리',
};

export interface MoverQuotesPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/**
 * 기사님 내 견적 관리 페이지
 */
const MoverQuotesPage = async ({ searchParams }: MoverQuotesPageProps) => {
  const params = await searchParams;
  const activeTab = parseMoverQuotesTabId(resolveQuotesTabParam(params.tab));

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <MoverQuotesTabs activeTab={activeTab} />
      <Suspense
        fallback={
          <QuotesPageContentSkeleton
            className={MOVER_QUOTES_PAGE_X_PADDING}
            withTabs={false}
          />
        }
      >
        <MoverQuotesPageClient />
      </Suspense>
    </div>
  );
};

export default MoverQuotesPage;

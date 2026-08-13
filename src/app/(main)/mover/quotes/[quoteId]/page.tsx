import { DETAIL_PAGE_X_PADDING } from '@/components/ui/Skeleton';

import MoverQuoteDetailPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '견적 상세',
};

interface MoverQuoteDetailPageProps {
  params: Promise<{ quoteId: string }>;
}

/**
 * 기사님 견적 상세 페이지
 */
const MoverQuoteDetailPage = async ({ params }: MoverQuoteDetailPageProps) => {
  const { quoteId } = await params;

  return (
    <div className="flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      <div
        className={`border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8 ${DETAIL_PAGE_X_PADDING}`}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          견적 상세
        </h1>
      </div>
      <MoverQuoteDetailPageClient quoteId={quoteId} />
    </div>
  );
};

export default MoverQuoteDetailPage;

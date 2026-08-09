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

  return <MoverQuoteDetailPageClient quoteId={quoteId} />;
};

export default MoverQuoteDetailPage;

import MoverQuoteDetailPageClient from './page.client';

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

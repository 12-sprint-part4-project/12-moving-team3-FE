import CustomerQuoteDetailPageClient from './page.client';

export interface CustomerQuoteDetailPageProps {
  params: Promise<{ quoteId: string }>;
}

/**
 * 고객 견적 상세 페이지
 */
const CustomerQuoteDetailPage = async ({
  params,
}: CustomerQuoteDetailPageProps) => {
  const { quoteId } = await params;
  return <CustomerQuoteDetailPageClient quoteId={quoteId} />;
};

export default CustomerQuoteDetailPage;

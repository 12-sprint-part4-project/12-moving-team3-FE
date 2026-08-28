import { createPageMetadata } from '@/i18n/createPageMetadata';
import { getServerTranslation } from '@/i18n/getServerTranslation';

import CustomerQuoteDetailPageClient from './page.client';
import { CUSTOMER_QUOTES_PAGE_X_PADDING } from '../_components/customerQuotesStyles';
import { CustomerQuotesTitleHeader } from '../_components/CustomerQuotesTitleHeader';

export const generateMetadata = createPageMetadata('meta.quoteDetail');

export interface CustomerQuoteDetailPageProps {
  params: Promise<{ quoteId: string }>;
}

/** `/quotes/[quoteId]` 서버 페이지. - 견적 상세. */
const CustomerQuoteDetailPage = async ({
  params,
}: CustomerQuoteDetailPageProps) => {
  const { t } = await getServerTranslation();
  const { quoteId } = await params;

  return (
    <div className="flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      <CustomerQuotesTitleHeader
        title={t('meta.quoteDetail')}
        paddingClassName={CUSTOMER_QUOTES_PAGE_X_PADDING}
      />
      <CustomerQuoteDetailPageClient quoteId={quoteId} />
    </div>
  );
};

export default CustomerQuoteDetailPage;

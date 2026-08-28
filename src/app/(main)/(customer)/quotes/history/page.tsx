import { createPageMetadata } from '@/i18n/createPageMetadata';
import { getServerTranslation } from '@/i18n/getServerTranslation';

import CustomerQuoteHistoryPageClient from './page.client';
import { CUSTOMER_QUOTES_PAGE_X_PADDING } from '../_components/customerQuotesStyles';
import { CustomerQuotesTitleHeader } from '../_components/CustomerQuotesTitleHeader';

export const generateMetadata = createPageMetadata('nav.profile.history');

/** `/quotes/history` 서버 페이지. - 이용 내역(확정 견적). */
const CustomerQuoteHistoryPage = async () => {
  const { t } = await getServerTranslation();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <CustomerQuotesTitleHeader
        title={t('nav.profile.history')}
        paddingClassName={CUSTOMER_QUOTES_PAGE_X_PADDING}
        className="shrink-0"
      />
      <CustomerQuoteHistoryPageClient />
    </div>
  );
};

export default CustomerQuoteHistoryPage;

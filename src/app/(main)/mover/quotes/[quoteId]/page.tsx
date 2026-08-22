import { createPageMetadata } from '@/i18n/createPageMetadata';
import { getServerTranslation } from '@/i18n/getServerTranslation';

import MoverQuoteDetailPageClient from './page.client';
import { MOVER_QUOTES_PAGE_X_PADDING } from '../_components/moverQuotesStyles';
import { MoverQuotesTitleHeader } from '../_components/MoverQuotesTitleHeader';

export const generateMetadata = createPageMetadata('meta.quoteDetail');

export interface MoverQuoteDetailPageProps {
  params: Promise<{ quoteId: string }>;
}

/** `/mover/quotes/[quoteId]` 서버 페이지. - 견적 상세. */
const MoverQuoteDetailPage = async ({ params }: MoverQuoteDetailPageProps) => {
  const { t } = await getServerTranslation();
  const { quoteId } = await params;

  return (
    <div className="flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      <MoverQuotesTitleHeader
        title={t('meta.quoteDetail')}
        paddingClassName={MOVER_QUOTES_PAGE_X_PADDING}
      />
      <MoverQuoteDetailPageClient quoteId={quoteId} />
    </div>
  );
};

export default MoverQuoteDetailPage;

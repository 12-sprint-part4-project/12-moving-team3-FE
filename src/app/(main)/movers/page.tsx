import { createPageMetadata } from '@/i18n/createPageMetadata';
import { getServerTranslation } from '@/i18n/getServerTranslation';
import { cn } from '@/lib/utils';

import { MOVERS_PAGE_X_PADDING } from './_components/moversLayout';
import MoversPageClient from './page.client';

export const generateMetadata = createPageMetadata('nav.findMovers');

/** `/movers` 서버 페이지. - 기사님 찾기 타이틀 셸. 필터·목록은 Client. */
const MoversPage = async () => {
  const { t } = await getServerTranslation();

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <div
        className={cn(
          'border-b border-line-100 bg-white py-4 shadow-page-title tablet:py-6 xl:py-8',
          MOVERS_PAGE_X_PADDING
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 xl:text-2xl-semibold">
          {t('nav.findMovers')}
        </h1>
      </div>
      <MoversPageClient />
    </div>
  );
};

export default MoversPage;

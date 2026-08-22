import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';
import { createPageMetadata } from '@/i18n/createPageMetadata';
import { getServerTranslation } from '@/i18n/getServerTranslation';

import { CommunityWritePageClient } from './page.client';

export const generateMetadata = createPageMetadata('community.writeTitle');

/** 커뮤니티 게시글 작성 페이지 */
const CommunityWritePage = async () => {
  const { t } = await getServerTranslation();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spinner message={t('common.pageLoading')} />
        </div>
      }
    >
      <CommunityWritePageClient />
    </Suspense>
  );
};

export default CommunityWritePage;

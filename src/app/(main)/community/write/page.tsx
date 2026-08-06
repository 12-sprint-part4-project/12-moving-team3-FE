import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';

import { CommunityWritePageClient } from './page.client';

/** 커뮤니티 게시글 작성 페이지 */
const CommunityWritePage = () => (
  <Suspense
    fallback={
      <div className="flex justify-center py-24">
        <Spinner message="페이지 불러오는 중..." />
      </div>
    }
  >
    <CommunityWritePageClient />
  </Suspense>
);

export default CommunityWritePage;

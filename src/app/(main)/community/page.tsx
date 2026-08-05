import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';

import { CommunityPageClient } from './page.client';

/** 커뮤니티 게시글 목록 페이지 */
const CommunityPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full w-full items-center justify-center bg-background-200">
          <Spinner message="목록 불러오는 중..." />
        </div>
      }
    >
      <CommunityPageClient />
    </Suspense>
  );
};

export default CommunityPage;

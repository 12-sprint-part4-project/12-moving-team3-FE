import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';

import { CommunityPostDetailPageClient } from './page.client';

interface CommunityPostDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 커뮤니티 게시글 상세 페이지 */
const CommunityPostDetailPage = async ({
  params,
}: CommunityPostDetailPageProps) => {
  const { id } = await params;
  const postId = Number(id);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-full w-full items-center justify-center bg-background-200">
          <Spinner message="게시글 불러오는 중..." />
        </div>
      }
    >
      <CommunityPostDetailPageClient postId={postId} />
    </Suspense>
  );
};

export default CommunityPostDetailPage;

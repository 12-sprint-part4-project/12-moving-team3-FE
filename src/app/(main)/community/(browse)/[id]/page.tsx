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

  return <CommunityPostDetailPageClient key={postId} postId={postId} />;
};

export default CommunityPostDetailPage;

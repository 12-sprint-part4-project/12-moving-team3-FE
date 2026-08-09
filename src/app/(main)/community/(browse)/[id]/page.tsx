import type { Metadata } from 'next';

import { getPostById } from '@/services/communityApi';

import { CommunityPostDetailPageClient } from './page.client';

interface CommunityPostDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 게시글 제목 기반 탭 타이틀 — `{title} | 무빙` */
export async function generateMetadata({
  params,
}: CommunityPostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) {
    return { title: { absolute: '게시글 | 무빙' } };
  }
  try {
    const res = await getPostById(postId);
    const postTitle = res.data.title?.trim();
    if (postTitle) {
      // 루트 template과 동일 패턴을 absolute로 고정 (제목만 노출되지 않도록)
      return { title: { absolute: `${postTitle} | 무빙` } };
    }
  } catch {
    // 404·네트워크 등 → fallback
  }
  return { title: { absolute: '게시글 | 무빙' } };
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

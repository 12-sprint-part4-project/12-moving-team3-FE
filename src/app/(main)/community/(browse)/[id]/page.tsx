import { COMMUNITY_TABS } from '@/constants/communityOptions';
import { getTabFromPostCategory } from '@/lib/communityListContext';
import { getPostById } from '@/services/communityApi';

import { CommunityPostDetailPageClient } from './page.client';

import type { Metadata } from 'next';

interface CommunityPostDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 실패·무제목 공통 fallback — absolute로 `| 무빙`까지 확정 */
const POST_TITLE_FALLBACK: Metadata = {
  title: { absolute: '게시글 | 무빙' },
};

/**
 * 게시글 상세 탭 타이틀
 * `{제목} > {게시판|가구나눔} | 무빙` — nested layout에서 template이 빠질 수 있어 absolute 사용
 */
export async function generateMetadata({
  params,
}: CommunityPostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) {
    return POST_TITLE_FALLBACK;
  }
  try {
    const res = await getPostById(postId);
    const tabId = getTabFromPostCategory(res.data.category);
    const tabLabel =
      COMMUNITY_TABS.find((tab) => tab.id === tabId)?.label ?? '게시판';
    const postTitle = res.data.title?.trim();
    if (postTitle) {
      return {
        title: { absolute: `${postTitle} > ${tabLabel} | 무빙` },
      };
    }
  } catch {
    // 404·네트워크 등 → fallback
  }
  return POST_TITLE_FALLBACK;
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

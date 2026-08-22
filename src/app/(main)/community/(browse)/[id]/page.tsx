import { isCommunityTabId } from '@/constants/communityOptions';
import { getServerTranslation } from '@/i18n/getServerTranslation';
import { getTabFromPostCategory } from '@/lib/communityListContext';
import { getPostById } from '@/services/communityApi';

import { CommunityPostDetailPageClient } from './page.client';

import type { Metadata } from 'next';

interface CommunityPostDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 게시글 상세 탭 타이틀
 * `{제목} > {게시판|가구나눔} | 무빙` — nested layout에서 template이 빠질 수 있어 absolute 사용
 */
export const generateMetadata = async ({
  params,
}: CommunityPostDetailPageProps): Promise<Metadata> => {
  const { t } = await getServerTranslation();
  const { id } = await params;
  const postId = Number(id);
  const brand = t('auth.brand');
  const postTitleFallback = t('meta.postDetailFallback');

  if (!Number.isFinite(postId) || postId <= 0) {
    return { title: { absolute: postTitleFallback } };
  }

  try {
    const res = await getPostById(postId);
    const tabId = getTabFromPostCategory(res.data.category);
    const tabLabel = isCommunityTabId(tabId)
      ? t(`community.tab.${tabId}`)
      : t('community.tab.board');
    const postTitle = res.data.title?.trim();

    if (postTitle) {
      return {
        title: { absolute: `${postTitle} > ${tabLabel} | ${brand}` },
      };
    }
  } catch {
    // 404·네트워크 등 → fallback
  }

  return { title: { absolute: postTitleFallback } };
};

/** 커뮤니티 게시글 상세 페이지 */
const CommunityPostDetailPage = async ({
  params,
}: CommunityPostDetailPageProps) => {
  const { id } = await params;
  const postId = Number(id);

  return <CommunityPostDetailPageClient key={postId} postId={postId} />;
};

export default CommunityPostDetailPage;

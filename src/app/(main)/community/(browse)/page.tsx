import { parsePostListContextFromSearchParams } from '@/lib/communityListContext';

import { CommunityPageClient } from './page.client';

interface CommunityPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** 커뮤니티 게시글 목록 페이지 */
const CommunityPage = async ({ searchParams }: CommunityPageProps) => {
  const params = await searchParams;
  const initialContext = parsePostListContextFromSearchParams({
    get: (key: string) => {
      const val = params[key];
      if (typeof val === 'string') return val;
      if (Array.isArray(val)) return val[0] ?? null;
      return null;
    },
  });

  return <CommunityPageClient initialContext={initialContext} />;
};

export default CommunityPage;

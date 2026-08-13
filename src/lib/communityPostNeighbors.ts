import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import { communityQueryKeys } from '@/constants/queryKey';
import type {
  PostListParams,
  PostListResponse,
  PostNeighborSummary,
  PostNeighbors,
} from '@/types/community';

const toNeighborSummary = (post: {
  id: number;
  title: string;
}): PostNeighborSummary => ({
  id: post.id,
  title: post.title,
});

const isSameListParams = (
  cached: PostListParams,
  target: PostListParams
): boolean =>
  cached.category === target.category &&
  cached.region === target.region &&
  (cached.sort ?? 'LATEST') === (target.sort ?? 'LATEST') &&
  (cached.keyword ?? undefined) === (target.keyword ?? undefined);

/** 목록 infinite query 캐시에서 이전/다음글 탐색 (BE 미연동·직접 URL 접근 대비) */
export const findPostNeighborsInListCache = (
  queryClient: QueryClient,
  postId: number,
  listParams: PostListParams
): PostNeighbors | null => {
  const entries = queryClient.getQueriesData<
    InfiniteData<PostListResponse>
  >({
    queryKey: communityQueryKeys.lists(),
  });

  for (const [queryKey, data] of entries) {
    if (!Array.isArray(queryKey)) {
      continue;
    }

    const cachedParams = queryKey[queryKey.length - 1];

    if (
      typeof cachedParams !== 'object' ||
      cachedParams === null ||
      !isSameListParams(cachedParams as PostListParams, listParams)
    ) {
      continue;
    }

    if (!data?.pages) {
      continue;
    }

    const posts = data.pages.flatMap((page) => page.data.items);
    const index = posts.findIndex((post) => post.id === postId);

    if (index === -1) {
      continue;
    }

    return {
      prev: index > 0 ? toNeighborSummary(posts[index - 1]) : null,
      next:
        index < posts.length - 1
          ? toNeighborSummary(posts[index + 1])
          : null,
    };
  }

  return null;
};

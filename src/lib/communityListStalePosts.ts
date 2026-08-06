import type { CommunityTabId } from '@/constants/communityOptions';
import type { PostCategory, PostListItem } from '@/types/community';

/** keepPreviousData placeholder가 현재 탭·필터와 맞지 않는지 */
export const hasStaleCommunityListPosts = (
  posts: PostListItem[],
  activeTab: CommunityTabId,
  listCategory: PostCategory | undefined
): boolean => {
  if (posts.length === 0) {
    return false;
  }

  if (activeTab === 'furniture') {
    return posts.some((post) => post.category !== 'FURNITURE_SHARE');
  }

  if (listCategory !== undefined) {
    return posts.some((post) => post.category !== listCategory);
  }

  return posts.every((post) => post.category === 'FURNITURE_SHARE');
};

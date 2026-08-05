const POST_VIEW_SESSION_PREFIX = 'community-post-view:';

export const getPostViewSessionKey = (postId: number): string =>
  `${POST_VIEW_SESSION_PREFIX}${postId}`;

/** 같은 탭 세션에서 이미 조회수를 전송했는지 확인 */
export const hasRecordedPostViewInSession = (postId: number): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return sessionStorage.getItem(getPostViewSessionKey(postId)) === '1';
};

/** 조회수 전송 성공 후 세션에 기록 */
export const markPostViewRecordedInSession = (postId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(getPostViewSessionKey(postId), '1');
};

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { communityQueryKeys } from '@/constants/queryKey';
import { findPostNeighborsInListCache } from '@/lib/communityPostNeighbors';
import {
  hasRecordedPostViewInSession,
  markPostViewRecordedInSession,
} from '@/lib/postViewTracking';
import { getPostById, getPostNeighbors, recordPostView } from '@/services/communityApi';
import type { PostListParams } from '@/types/community';

/** 게시글 상세 조회 */
export const usePost = (postId: number) =>
  useQuery({
    queryKey: communityQueryKeys.detail(postId),
    queryFn: () => getPostById(postId),
    select: (response) => response.data,
    enabled: postId > 0,
  });

/** 게시글 이전/다음글 조회 — BE 우선, 목록 캐시 fallback */
export const usePostNeighbors = (
  postId: number,
  listParams: PostListParams = {}
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: communityQueryKeys.neighbors(postId, listParams),
    queryFn: () => getPostNeighbors(postId, listParams),
    select: (response) => response.data,
    enabled: postId > 0,
    retry: false,
  });

  const cachedNeighbors = useMemo(
    () => findPostNeighborsInListCache(queryClient, postId, listParams),
    [queryClient, postId, listParams]
  );

  return {
    ...query,
    neighbors: query.data ?? cachedNeighbors,
  };
};

/**
 * 게시글 조회수 BE 전송 — 상세 로드 성공 후 세션당 1회.
 * UI에 조회수를 표시하지 않으며, 실패해도 사용자에게 노출하지 않는다.
 */
const inFlightPostViewIds = new Set<number>();

export const useRecordPostView = (postId: number, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || postId <= 0) return;
    if (hasRecordedPostViewInSession(postId)) return;
    if (inFlightPostViewIds.has(postId)) return;

    inFlightPostViewIds.add(postId);

    void recordPostView(postId)
      .then(() => {
        markPostViewRecordedInSession(postId);
      })
      .catch(() => {
        // BE 미구현·네트워크 오류 — UI 영향 없음
      })
      .finally(() => {
        inFlightPostViewIds.delete(postId);
      });
  }, [postId, enabled]);
};

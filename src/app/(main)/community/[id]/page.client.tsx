'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  type CommunityTabId,
} from '@/constants/communityOptions';
import { useAuth } from '@/hooks/useAuth';
import {
  useCommentList,
  useCreateComment,
  usePost,
  useRecordPostView,
  useTogglePostLike,
} from '@/hooks/useCommunity';
import { ApiError } from '@/lib/apiClient';
import { formatDotDateLabel } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { PostCategory } from '@/types/community';

import { CommunityCategoryBadge } from '../_components/CommunityCategoryBadge';
import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_DETAIL_MAX_W,
  COMMUNITY_DETAIL_MOBILE_BOTTOM_PAD,
  COMMUNITY_PAGE_SHELL,
  COMMUNITY_SECTION_X,
} from '../_components/communityLayout';
import { CommunityTabBar } from '../_components/CommunityTabBar';
import { CommunityCommentList } from './_components/CommunityCommentList';
import {
  COMMUNITY_DETAIL_BODY_TEXT,
  COMMUNITY_DETAIL_DIVIDER,
  COMMUNITY_DETAIL_META_TEXT,
} from './_components/communityDetailStyles';
import { CommunityPostDetailImages } from './_components/CommunityPostDetailImages';
import { CommunityPostEngagementBar } from './_components/CommunityPostEngagementBar';
import { CommunityPostShareButtons } from './_components/CommunityPostShareButtons';

interface CommunityPostDetailPageClientProps {
  postId: number;
}

const getActiveTab = (category: PostCategory): CommunityTabId =>
  category === 'FURNITURE_SHARE' ? 'furniture' : 'board';

const formatPostMeta = (nickname: string, createdAt: string): string => {
  const dateLabel = formatDotDateLabel(createdAt);
  return dateLabel ? `${nickname} · ${dateLabel}` : nickname;
};

/** 커뮤니티 게시글 상세 — Figma Mobile / Tablet / Desktop */
export const CommunityPostDetailPageClient = ({
  postId,
}: CommunityPostDetailPageClientProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
    isSuccess: isPostSuccess,
    error: postError,
    refetch: refetchPost,
  } = usePost(postId);

  useRecordPostView(postId, isPostSuccess);

  const {
    comments,
    isPending: isCommentsPending,
    isError: isCommentsError,
    isEmpty: isCommentsEmpty,
    isFetchingNextPage: isCommentsFetchingNextPage,
    isFetchNextPageError: isCommentsFetchNextPageError,
    error: commentsError,
    hasNextPage: hasCommentsNextPage,
    fetchNextPage: fetchCommentsNextPage,
    refetch: refetchComments,
  } = useCommentList(postId);

  const { togglePostLike, isPending: isLikePending } = useTogglePostLike();
  const { mutate: createComment, isPending: isCommentPending } =
    useCreateComment(postId);

  const { ref: commentsLoadMoreRef, inView: isCommentsLoadMoreInView } =
    useInView({ rootMargin: '200px' });

  const activeTab = useMemo(
    () => (post ? getActiveTab(post.category) : 'board'),
    [post]
  );

  const imageUrls = useMemo(
    () =>
      post?.images
        .map((image) => image.imageUrl)
        .filter((url): url is string => url !== null) ?? [],
    [post]
  );

  const shareImageUrl = imageUrls[0] ?? null;
  const shareDescription = post?.content.slice(0, 100) ?? null;

  const handleTabChange = useCallback(
    (tabId: CommunityTabId) => {
      router.push(`/community?tab=${tabId}`);
    },
    [router]
  );

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleLikeClick = useCallback(() => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!post || post.isLiked === null) {
      return;
    }

    togglePostLike(postId, !post.isLiked);
  }, [user, post, postId, togglePostLike, openLoginModal]);

  const handleCommentSubmit = useCallback(
    (content: string) => {
      if (!user) {
        openLoginModal();
        return;
      }

      createComment({ content });
    },
    [user, createComment, openLoginModal]
  );

  const handleCommentInputFocus = useCallback(() => {
    if (!user) {
      openLoginModal();
    }
  }, [user, openLoginModal]);

  useEffect(() => {
    if (
      isCommentsLoadMoreInView &&
      hasCommentsNextPage &&
      !isCommentsFetchingNextPage
    ) {
      void fetchCommentsNextPage();
    }
  }, [
    isCommentsLoadMoreInView,
    hasCommentsNextPage,
    isCommentsFetchingNextPage,
    fetchCommentsNextPage,
  ]);

  if (postId <= 0 || Number.isNaN(postId)) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-24">
        <p className="text-lg-medium text-gray-400">잘못된 게시글 주소예요.</p>
      </div>
    );
  }

  if (isPostPending) {
    return (
      <div className={COMMUNITY_PAGE_SHELL}>
        <CommunityTabBar activeTab="board" onTabChange={handleTabChange} />
        <div className="flex justify-center py-24">
          <Spinner message="게시글 불러오는 중..." />
        </div>
      </div>
    );
  }

  const isNotFound =
    isPostError && postError instanceof ApiError && postError.status === 404;

  if (isNotFound) {
    return (
      <div className={COMMUNITY_PAGE_SHELL}>
        <CommunityTabBar activeTab="board" onTabChange={handleTabChange} />
        <div className="flex w-full flex-col items-center justify-center py-24">
          <p className="text-lg-medium text-gray-400">
            게시글을 찾을 수 없어요.
          </p>
        </div>
      </div>
    );
  }

  if (isPostError || !post) {
    const errorMessage =
      postError instanceof ApiError
        ? postError.message
        : (postError?.message ?? '게시글을 불러오지 못했습니다.');

    return (
      <div className={COMMUNITY_PAGE_SHELL}>
        <CommunityTabBar activeTab="board" onTabChange={handleTabChange} />
        <div className="flex w-full flex-col items-center gap-4 py-24">
          <p className="text-lg-medium text-gray-400">{errorMessage}</p>
          <Button
            variant="outlined"
            size="md"
            onClick={() => {
              void refetchPost();
            }}
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const commentsErrorMessage =
    commentsError instanceof ApiError
      ? commentsError.message
      : (commentsError?.message ?? '댓글을 불러오지 못했습니다.');

  const isLiked = post.isLiked === true;

  return (
    <div className={COMMUNITY_PAGE_SHELL}>
      <CommunityTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <article
        className={cn(
          COMMUNITY_SECTION_X,
          COMMUNITY_DESKTOP_X,
          COMMUNITY_DETAIL_MOBILE_BOTTOM_PAD,
          'pt-6 min-[46.5rem]:pt-8 xl:pt-10'
        )}
      >
        <div className={COMMUNITY_DETAIL_MAX_W}>
          <CommunityCategoryBadge category={post.category} />

          <div className="mt-4 min-[46.5rem]:mt-5 xl:mt-6">
            <div className="flex items-start justify-between gap-3">
              <h1
                className={cn(
                  'min-w-0 flex-1 font-bold text-[#1a1a1a]',
                  'text-[1.125rem] min-[46.5rem]:text-[1.25rem] xl:text-[1.75rem]'
                )}
              >
                {post.title}
              </h1>
              <CommunityPostShareButtons
                title={post.title}
                description={shareDescription}
                imageUrl={shareImageUrl}
                className="mt-0.5"
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-2 xl:mt-3">
              <p className={COMMUNITY_DETAIL_META_TEXT}>
                {formatPostMeta(post.author.nickname, post.createdAt)}
              </p>
              <button
                type="button"
                aria-label="게시글 메뉴"
                className="shrink-0 cursor-pointer px-1 text-xl leading-none text-[#8c8c8c] min-[46.5rem]:hidden"
              >
                ⋮
              </button>
            </div>
          </div>

          <div
            className={cn(
              COMMUNITY_DETAIL_DIVIDER,
              'mt-3 min-[46.5rem]:mt-4 xl:mt-5'
            )}
          />

          {imageUrls.length > 0 ? (
            <CommunityPostDetailImages
              imageUrls={imageUrls}
              className="mt-6 min-[46.5rem]:mt-8 xl:mt-10"
            />
          ) : null}

          <p
            className={cn(
              COMMUNITY_DETAIL_BODY_TEXT,
              imageUrls.length > 0
                ? 'mt-4 min-[46.5rem]:mt-6 xl:mt-8'
                : 'mt-6 min-[46.5rem]:mt-8 xl:mt-10'
            )}
          >
            {post.content}
          </p>

          <CommunityCommentList
            comments={comments}
            commentCount={post.commentCount}
            isPending={isCommentsPending}
            isError={isCommentsError}
            isEmpty={isCommentsEmpty}
            isFetchingNextPage={isCommentsFetchingNextPage}
            isFetchNextPageError={isCommentsFetchNextPageError}
            errorMessage={commentsErrorMessage}
            onRetry={() => {
              void refetchComments();
            }}
            onRetryNextPage={() => {
              void fetchCommentsNextPage();
            }}
            loadMoreRef={commentsLoadMoreRef}
            className="mt-8 min-[46.5rem]:mt-10 xl:mt-12"
          />

          <CommunityPostEngagementBar
            isLiked={isLiked}
            isLikePending={isLikePending}
            isCommentPending={isCommentPending}
            onLikeClick={handleLikeClick}
            onCommentSubmit={handleCommentSubmit}
            onCommentFocus={handleCommentInputFocus}
            className="mt-6 min-[46.5rem]:mt-8 xl:mt-10"
          />
        </div>
      </article>

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

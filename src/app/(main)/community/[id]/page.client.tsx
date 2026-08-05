'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { Button } from '@/components/Button/Button';
import { ReportAction } from '@/components/reports';
import { Modal } from '@/components/ui/Modal/Modal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  type CommunityTabId,
} from '@/constants/communityOptions';
import { useAuth } from '@/hooks/useAuth';
import {
  useCommentList,
  useCreateComment,
  useDeleteComment,
  useDeletePost,
  usePost,
  usePostNeighbors,
  useRecordPostView,
  useTogglePostLike,
} from '@/hooks/useCommunity';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  parsePostListContextFromSearchParams,
  postListContextToParams,
} from '@/lib/communityListContext';
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
import { CommentDeleteModal } from './_components/CommentDeleteModal';
import { PostDeleteModal } from './_components/PostDeleteModal';
import {
  COMMUNITY_DETAIL_BODY_TEXT,
  COMMUNITY_DETAIL_DIVIDER,
  COMMUNITY_DETAIL_META_DATE,
  COMMUNITY_DETAIL_META_NICKNAME,
  COMMUNITY_POST_ICON_GROUP_GAP_CLASS,
} from './_components/communityDetailStyles';
import { CommunityPostDetailImages } from './_components/CommunityPostDetailImages';
import { CommunityPostEngagementBar } from './_components/CommunityPostEngagementBar';
import { CommunityPostMoreMenu } from './_components/CommunityPostMoreMenu';
import { CommunityPostNavigation } from './_components/CommunityPostNavigation';
import { CommunityPostShareButtons } from './_components/CommunityPostShareButtons';

interface CommunityPostDetailPageClientProps {
  postId: number;
}

const getActiveTab = (category: PostCategory): CommunityTabId =>
  category === 'FURNITURE_SHARE' ? 'furniture' : 'board';

/** 커뮤니티 게시글 상세 — Figma Mobile / Tablet / Desktop */
export const CommunityPostDetailPageClient = ({
  postId,
}: CommunityPostDetailPageClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null
  );
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
    isSuccess: isPostSuccess,
    error: postError,
    refetch: refetchPost,
  } = usePost(postId);

  const listContext = useMemo(
    () => parsePostListContextFromSearchParams(searchParams),
    [searchParams]
  );

  const listParams = useMemo(
    () => postListContextToParams(listContext),
    [listContext]
  );

  const { neighbors } = usePostNeighbors(postId, listParams);

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
  const { mutate: deleteCommentMutate, isPending: isDeleteCommentPending } =
    useDeleteComment(postId);
  const { mutate: deletePostMutate, isPending: isDeletePostPending } =
    useDeletePost();

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

  const handleDeleteCommentRequest = useCallback((commentId: number) => {
    setCommentIdToDelete(commentId);
  }, []);

  const handleDeleteCommentModalClose = useCallback(() => {
    if (isDeleteCommentPending) {
      return;
    }
    setCommentIdToDelete(null);
  }, [isDeleteCommentPending]);

  const handleDeleteCommentConfirm = useCallback(() => {
    if (commentIdToDelete === null || isDeleteCommentPending) {
      return;
    }

    deleteCommentMutate(commentIdToDelete, {
      onSuccess: () => {
        setCommentIdToDelete(null);
        showToast({ content: '댓글이 삭제되었습니다.' });
      },
      onError: (error: unknown) => {
        const message =
          error instanceof ApiError
            ? error.message
            : '댓글 삭제에 실패했습니다.';
        showToast({ content: message });
      },
    });
  }, [
    commentIdToDelete,
    deleteCommentMutate,
    isDeleteCommentPending,
    showToast,
  ]);

  const handlePostEdit = useCallback(() => {
    router.push(`/community/write?postId=${postId}`);
  }, [postId, router]);

  const handlePostDeleteRequest = useCallback(() => {
    setIsPostDeleteModalOpen(true);
  }, []);

  const handleCopyPostLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast({ content: '링크가 복사되었습니다.' });
    } catch {
      showToast({ content: '링크 복사에 실패했습니다.' });
    }
  }, [showToast]);

  const handlePostDeleteModalClose = useCallback(() => {
    if (isDeletePostPending) {
      return;
    }
    setIsPostDeleteModalOpen(false);
  }, [isDeletePostPending]);

  const handlePostDeleteConfirm = useCallback(() => {
    if (isDeletePostPending) {
      return;
    }

    deletePostMutate(postId, {
      onSuccess: () => {
        setIsPostDeleteModalOpen(false);
        showToast({ content: '게시글이 삭제되었습니다.' });
        router.push('/community');
      },
      onError: (error: unknown) => {
        const message =
          error instanceof ApiError
            ? error.message
            : '게시글 삭제에 실패했습니다.';
        showToast({ content: message });
      },
    });
  }, [deletePostMutate, isDeletePostPending, postId, router, showToast]);

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

  const postDateLabel = formatDotDateLabel(post.createdAt);

  const commentsErrorMessage =
    commentsError instanceof ApiError
      ? commentsError.message
      : (commentsError?.message ?? '댓글을 불러오지 못했습니다.');

  const isLiked = post.isLiked === true;
  const isPostOwner = user?.id === post.author.id;

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
            <h1
              className={cn(
                'font-bold text-[#1a1a1a]',
                'text-[1.125rem] min-[46.5rem]:text-[1.25rem] xl:text-[1.75rem]'
              )}
            >
              {post.title}
            </h1>

            <div className="mt-2 flex items-center justify-between gap-2 xl:mt-3">
              <p
                className={cn(
                  'flex min-w-0 items-center gap-x-1 min-[46.5rem]:gap-x-1.5'
                )}
              >
                <span className={COMMUNITY_DETAIL_META_NICKNAME}>
                  {post.author.nickname}
                </span>
                {postDateLabel ? (
                  <>
                    <span
                      className={COMMUNITY_DETAIL_META_DATE}
                      aria-hidden
                    >
                      ·
                    </span>
                    <span className={COMMUNITY_DETAIL_META_DATE}>
                      {postDateLabel}
                    </span>
                  </>
                ) : null}
              </p>
              <div
                className={cn(
                  'flex shrink-0 items-center self-center',
                  COMMUNITY_POST_ICON_GROUP_GAP_CLASS
                )}
              >
                {!isPostOwner ? (
                  <ReportAction
                    target="ARTICLE"
                    targetId={String(postId)}
                    buttonVariant="icon-only"
                    className="relative z-10 flex items-center self-center"
                  />
                ) : null}
                <CommunityPostMoreMenu
                  isPostOwner={isPostOwner}
                  onCopyLink={handleCopyPostLink}
                  onEdit={handlePostEdit}
                  onDelete={handlePostDeleteRequest}
                />
              </div>
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
                ? 'mt-[1.5625rem] min-[46.5rem]:mt-[2.375rem] xl:mt-16'
                : 'mt-[2.375rem] min-[46.5rem]:mt-[3.2rem] xl:mt-20'
            )}
          >
            {post.content}
          </p>

          <CommunityCommentList
            comments={comments}
            commentCount={post.commentCount}
            postAuthorId={post.author.id}
            currentUserId={user?.id}
            deletingCommentId={
              isDeleteCommentPending ? commentIdToDelete : null
            }
            onDeleteRequest={user ? handleDeleteCommentRequest : undefined}
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
            headerAction={
              <CommunityPostShareButtons
                title={post.title}
                description={shareDescription}
                imageUrl={shareImageUrl}
              />
            }
            className="mt-[3.2rem] min-[46.5rem]:mt-16 xl:mt-24"
          />

          <CommunityPostEngagementBar
            isLiked={isLiked}
            isLikePending={isLikePending}
            isCommentPending={isCommentPending}
            onLikeClick={handleLikeClick}
            onCommentSubmit={handleCommentSubmit}
            onCommentFocus={handleCommentInputFocus}
            className="max-[46.4375rem]:mt-0 mt-6 min-[46.5rem]:mt-8 xl:mt-10"
          />

          <CommunityPostNavigation
            prev={neighbors?.prev ?? null}
            next={neighbors?.next ?? null}
            listContext={listContext}
          />
        </div>
      </article>

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeLoginModal} />

      {commentIdToDelete !== null ? (
        <Modal placement="bottom" onClose={handleDeleteCommentModalClose}>
          <CommentDeleteModal
            onClose={handleDeleteCommentModalClose}
            onConfirm={handleDeleteCommentConfirm}
            isDeleting={isDeleteCommentPending}
          />
        </Modal>
      ) : null}

      {isPostDeleteModalOpen ? (
        <Modal placement="bottom" onClose={handlePostDeleteModalClose}>
          <PostDeleteModal
            onClose={handlePostDeleteModalClose}
            onConfirm={handlePostDeleteConfirm}
            isDeleting={isDeletePostPending}
          />
        </Modal>
      ) : null}
    </div>
  );
};

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { Button } from '@/components/Button/Button';
import { ReportAction } from '@/components/reports';
import { Modal } from '@/components/ui/Modal/Modal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
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
import { ApiError, resolveApiErrorMessage } from '@/lib/apiClient';
import {
  getTabFromPostCategory,
  parsePostListContextFromSearchParams,
  postListContextToParams,
} from '@/lib/communityListContext';
import { formatDotDateLabel } from '@/lib/formatDate';
import { stripCommunityPostMarkdown } from '@/lib/stripCommunityPostMarkdown';
import { cn } from '@/lib/utils';

import { CommunityPostBadges } from '../../_components/CommunityPostBadges';
import { useCommunityTabBarOverride } from '../../_components/CommunityLayoutClient';
import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_DETAIL_MAX_W,
  COMMUNITY_DETAIL_MOBILE_BOTTOM_PAD,
  COMMUNITY_SECTION_X,
} from '../../_components/communityLayout';
import { CommunityCommentList } from './_components/CommunityCommentList';
import { CommunityFurnitureShareDetailActions } from './_components/CommunityFurnitureShareDetailActions';
import { CommunityPostDetailContent } from './_components/CommunityPostDetailContent';
import { ConfirmDeleteModal } from './_components/ConfirmDeleteModal';
import {
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
import { useCommunityFurnitureShareDetail } from './_lib/useCommunityFurnitureShareDetail';

type AuthModalKind = 'login' | 'profile';

interface CommunityPostDetailPageClientProps {
  postId: number;
}

const DETAIL_STATE_MESSAGE_CLASS =
  'flex w-full flex-col items-center justify-center py-24';

/** 커뮤니티 게시글 상세 — Figma Mobile / Tablet / Desktop */
export const CommunityPostDetailPageClient = ({
  postId,
}: CommunityPostDetailPageClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [authModalKind, setAuthModalKind] = useState<AuthModalKind | null>(
    null
  );
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null
  );
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
    isSuccess: isPostSuccess,
    error: postError,
    refetch: refetchPost,
  } = usePost(postId);

  const { setActiveTabOverride } = useCommunityTabBarOverride();

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

  const showMutationError = useCallback(
    (error: unknown, fallback: string) => {
      showToast({ content: resolveApiErrorMessage(error, fallback) });
    },
    [showToast]
  );

  const imageUrls = useMemo(
    () =>
      post?.images
        .map((image) => image.imageUrl)
        .filter((url): url is string => url !== null) ?? [],
    [post]
  );

  const shareImageUrl = imageUrls[0] ?? null;
  const postContent = post?.content;
  const shareDescription = useMemo(() => {
    if (postContent === undefined) {
      return null;
    }

    const plainText = stripCommunityPostMarkdown(postContent);

    return plainText.length > 0 ? plainText.slice(0, 100) : null;
  }, [postContent]);

  useEffect(() => {
    if (post) {
      setActiveTabOverride(getTabFromPostCategory(post.category));
    }

    return () => {
      setActiveTabOverride(null);
    };
  }, [post, setActiveTabOverride]);

  const openLoginModal = useCallback(() => {
    setAuthModalKind('login');
  }, []);

  const openProfileModal = useCallback(() => {
    setAuthModalKind('profile');
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalKind(null);
  }, []);

  /** 로그인·프로필 완료 필요. false면 이후 액션 중단 */
  const ensureProfileReady = useCallback((): boolean => {
    if (!user) {
      openLoginModal();
      return false;
    }
    if (!user.isProfileCompleted) {
      openProfileModal();
      return false;
    }
    return true;
  }, [user, openLoginModal, openProfileModal]);

  const {
    detailAction,
    isCompleteModalOpen,
    handleFurnitureShareChatClick,
    handleCompleteModalOpen,
    handleCompleteModalClose,
    handleCompleteConfirm,
    isChatRoomPending,
  } = useCommunityFurnitureShareDetail({
    post,
    postId,
    user,
    openLoginModal,
    openProfileModal,
  });

  const handleLikeClick = useCallback(() => {
    if (!ensureProfileReady()) {
      return;
    }

    if (!post) {
      return;
    }

    if (post.isLiked === null) {
      showToast({ content: '좋아요 정보를 불러오지 못했습니다.' });
      return;
    }

    togglePostLike(postId, !post.isLiked, {
      onError: (error) => {
        showMutationError(error, '좋아요 처리에 실패했습니다.');
      },
    });
  }, [ensureProfileReady, post, postId, togglePostLike, showToast, showMutationError]);

  const handleCommentSubmit = useCallback(
    (content: string) => {
      if (!ensureProfileReady()) {
        return;
      }

      createComment(
        { content },
        {
          onSuccess: () => {
            setCommentDraft('');
          },
          onError: (error) => {
            showMutationError(error, '댓글 작성에 실패했습니다.');
          },
        }
      );
    },
    [ensureProfileReady, createComment, showMutationError]
  );

  const handleCommentInputFocus = useCallback(() => {
    // 비회원만 포커스 시 로그인 유도. 프로필 미완료는 제출 시에만 모달
    // (취소 후 포커스 복원으로 모달이 다시 열리는 것 방지)
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
      onError: (error) => {
        showMutationError(error, '댓글 삭제에 실패했습니다.');
      },
    });
  }, [
    commentIdToDelete,
    deleteCommentMutate,
    isDeleteCommentPending,
    showToast,
    showMutationError,
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
      onError: (error) => {
        showMutationError(error, '게시글 삭제에 실패했습니다.');
      },
    });
  }, [deletePostMutate, isDeletePostPending, postId, router, showToast, showMutationError]);

  useEffect(() => {
    if (
      isCommentsLoadMoreInView &&
      hasCommentsNextPage &&
      !isCommentsFetchingNextPage &&
      !isCommentsFetchNextPageError
    ) {
      void fetchCommentsNextPage();
    }
  }, [
    isCommentsLoadMoreInView,
    hasCommentsNextPage,
    isCommentsFetchingNextPage,
    isCommentsFetchNextPageError,
    fetchCommentsNextPage,
  ]);

  if (postId <= 0 || Number.isNaN(postId)) {
    return (
      <div className={DETAIL_STATE_MESSAGE_CLASS}>
        <p className="text-lg-medium text-gray-400">잘못된 게시글 주소예요.</p>
      </div>
    );
  }

  if (isPostPending) {
    return (
      <div className="flex justify-center py-24">
        <Spinner message="게시글 불러오는 중..." />
      </div>
    );
  }

  const isNotFound =
    isPostError && postError instanceof ApiError && postError.status === 404;

  if (isNotFound) {
    return (
      <div className={DETAIL_STATE_MESSAGE_CLASS}>
        <p className="text-lg-medium text-gray-400">
          게시글을 찾을 수 없어요.
        </p>
      </div>
    );
  }

  if (isPostError || !post) {
    const errorMessage = resolveApiErrorMessage(
      postError,
      '게시글을 불러오지 못했습니다.'
    );

    return (
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
    );
  }

  const postDateLabel = formatDotDateLabel(post.createdAt);

  const commentsErrorMessage = resolveApiErrorMessage(
    commentsError,
    '댓글을 불러오지 못했습니다.'
  );

  const isLiked = post.isLiked === true;
  const isLikeDisabled = user !== undefined && post.isLiked === null;
  const isPostOwner = user?.id === post.author.id;

  return (
    <>
      <article
        className={cn(
          COMMUNITY_SECTION_X,
          COMMUNITY_DESKTOP_X,
          COMMUNITY_DETAIL_MOBILE_BOTTOM_PAD,
          'pt-6 min-[46.5rem]:pt-8 xl:pt-10'
        )}
      >
        <div className={COMMUNITY_DETAIL_MAX_W}>
          <CommunityPostBadges category={post.category} region={post.region} />

          <div className="mt-4 min-[46.5rem]:mt-5 xl:mt-6">
            <h1
              className={cn(
                'text-2xl-bold text-black-400',
                'min-[46.5rem]:text-2xl-bold xl:text-3xl-bold'
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

          <CommunityPostDetailContent
            content={post.content}
            className={
              imageUrls.length > 0
                ? 'mt-[1.5625rem] min-[46.5rem]:mt-[2.375rem] xl:mt-16'
                : 'mt-[2.375rem] min-[46.5rem]:mt-[3.2rem] xl:mt-20'
            }
          />

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
            isFetchingNextPage={isCommentsFetchingNextPage}
            isFetchNextPageError={isCommentsFetchNextPageError}
            errorMessage={commentsErrorMessage}
            onRetry={() => {
              void refetchComments();
            }}
            onRetryNextPage={() => {
              if (isCommentsFetchingNextPage) {
                return;
              }
              void fetchCommentsNextPage();
            }}
            loadMoreRef={commentsLoadMoreRef}
            beforeHeader={
              <CommunityFurnitureShareDetailActions
                action={detailAction}
                onChatClick={handleFurnitureShareChatClick}
                onCompleteClick={handleCompleteModalOpen}
                isChatPending={isChatRoomPending}
              />
            }
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
            isLikeDisabled={isLikeDisabled}
            isCommentPending={isCommentPending}
            onLikeClick={handleLikeClick}
            commentValue={commentDraft}
            onCommentChange={setCommentDraft}
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

      <LoginRequiredModal open={authModalKind === 'login'} onClose={closeAuthModal} />
      <ProfileRequiredModal
        open={authModalKind === 'profile'}
        onClose={closeAuthModal}
      />

      {commentIdToDelete !== null ? (
        <Modal placement="bottom" onClose={handleDeleteCommentModalClose}>
          <ConfirmDeleteModal
            title="댓글 삭제"
            message="작성한 댓글을 삭제하시겠습니까?"
            onClose={handleDeleteCommentModalClose}
            onConfirm={handleDeleteCommentConfirm}
            isDeleting={isDeleteCommentPending}
          />
        </Modal>
      ) : null}

      {isPostDeleteModalOpen ? (
        <Modal placement="bottom" onClose={handlePostDeleteModalClose}>
          <ConfirmDeleteModal
            title="게시글 삭제"
            message={
              <>
                작성한 게시글을 삭제하시겠습니까?
                <br />
                삭제 후에는 복구할 수 없습니다.
              </>
            }
            onClose={handlePostDeleteModalClose}
            onConfirm={handlePostDeleteConfirm}
            isDeleting={isDeletePostPending}
          />
        </Modal>
      ) : null}

      {isCompleteModalOpen ? (
        <Modal placement="bottom" onClose={handleCompleteModalClose}>
          <ConfirmDeleteModal
            title="나눔 완료"
            message={
              <>
                나눔을 완료 처리하시겠습니까?
                <br />
                완료 후에는 더 이상 나눔 받기 요청을 받을 수 없습니다.
              </>
            }
            confirmLabel="완료하기"
            onClose={handleCompleteModalClose}
            onConfirm={handleCompleteConfirm}
          />
        </Modal>
      ) : null}
    </>
  );
};

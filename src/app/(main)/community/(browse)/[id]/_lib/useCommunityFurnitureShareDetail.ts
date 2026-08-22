'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useCreateChatRoom } from '@/hooks/useChat';
import { useCompletePost } from '@/hooks/usePostMutations';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  isFurnitureSharePost,
  resolveFurnitureShareCompleted,
  resolveFurnitureShareDetailAction,
  type FurnitureShareDetailAction,
} from '@/lib/communityFurnitureShare';

import type { AuthUser } from '@/types/auth';
import type { PostDetail } from '@/types/community';

interface UseCommunityFurnitureShareDetailParams {
  post: PostDetail | undefined;
  postId: number;
  user: AuthUser | null;
  openLoginModal: () => void;
  openProfileModal: () => void;
}

interface UseCommunityFurnitureShareDetailResult {
  detailAction: FurnitureShareDetailAction | null;
  isCompleteModalOpen: boolean;
  handleFurnitureShareChatClick: () => void;
  handleCompleteModalOpen: () => void;
  handleCompleteModalClose: () => void;
  handleCompleteConfirm: () => void;
  isChatRoomPending: boolean;
  isCompletePending: boolean;
}

/** 가구나눔 상세 — 채팅·완료 CTA 상태·핸들러 */
export const useCommunityFurnitureShareDetail = ({
  post,
  postId,
  user,
  openLoginModal,
  openProfileModal,
}: UseCommunityFurnitureShareDetailParams): UseCommunityFurnitureShareDetailResult => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const { mutate: createChatRoom, isPending: isChatRoomPending } =
    useCreateChatRoom();
  const { mutate: completePost, isPending: isCompletePending } =
    useCompletePost(postId);

  const isPostOwner = post !== undefined && user?.id === post.author.id;
  const isFurnitureShare =
    post !== undefined && isFurnitureSharePost(post.category);
  const isCompleted =
    post !== undefined && resolveFurnitureShareCompleted(post.isCompleted);

  const detailAction =
    post === undefined
      ? null
      : resolveFurnitureShareDetailAction(
          isFurnitureShare,
          isPostOwner,
          isCompleted
        );

  const handleFurnitureShareChatClick = useCallback(() => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!user.isProfileCompleted) {
      openProfileModal();
      return;
    }

    if (post === undefined || user.id === post.author.id) {
      return;
    }

    if (isCompleted) {
      showToast({ content: t('community.shareCompletedPost') });
      return;
    }

    createChatRoom(
      {
        roomType: 'COMMUNITY',
        moverId: post.author.id,
        communityPostId: postId,
      },
      {
        onSuccess: (response) => {
          router.push(`/chat/${response.data.roomId}`);
        },
        onError: (error) => {
          showToast({
            content: resolveApiErrorMessage(error, t('chat.openRoomFail')),
          });
        },
      }
    );
  }, [
    user,
    post,
    isCompleted,
    createChatRoom,
    postId,
    openLoginModal,
    openProfileModal,
    router,
    showToast,
    t,
  ]);

  const handleCompleteModalOpen = useCallback(() => {
    setIsCompleteModalOpen(true);
  }, []);

  const handleCompleteModalClose = useCallback(() => {
    if (isCompletePending) {
      return;
    }
    setIsCompleteModalOpen(false);
  }, [isCompletePending]);

  const handleCompleteConfirm = useCallback(() => {
    completePost(undefined, {
      onSuccess: () => {
        setIsCompleteModalOpen(false);
        showToast({ content: t('community.shareCompleted') });
      },
      onError: (error) => {
        showToast({
          content: resolveApiErrorMessage(
            error,
            t('community.shareCompleteFail')
          ),
        });
      },
    });
  }, [completePost, showToast, t]);

  return {
    detailAction,
    isCompleteModalOpen,
    handleFurnitureShareChatClick,
    handleCompleteModalOpen,
    handleCompleteModalClose,
    handleCompleteConfirm,
    isChatRoomPending,
    isCompletePending,
  };
};

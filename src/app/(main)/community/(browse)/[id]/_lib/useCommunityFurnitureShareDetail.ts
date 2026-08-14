'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useCreateChatRoom } from '@/hooks/useChat';
import { useCompletePost } from '@/hooks/useCommunity';
import { useToast } from '@/hooks/useToast';
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
      showToast({ content: '나눔이 완료된 게시글입니다.' });
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
            content: resolveApiErrorMessage(error, '채팅방을 열지 못했습니다.'),
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
        showToast({ content: '나눔이 완료되었습니다.' });
      },
      onError: (error) => {
        showToast({
          content: resolveApiErrorMessage(
            error,
            '나눔 완료 처리에 실패했습니다.'
          ),
        });
      },
    });
  }, [completePost, showToast]);

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

'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useCreateChatRoom } from '@/hooks/useChat';
import { useToast } from '@/hooks/useToast';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  buildEstimateChatRoomBody,
  type BuildEstimateChatRoomBodyParams,
} from '@/lib/startEstimateChat';

export type StartEstimateChatParams = BuildEstimateChatRoomBodyParams;

/**
 * 견적·지정 플로우 공통 채팅 시작 훅 (#162).
 * 사용 화면: `/quotes` 대기카드, `/movers/[id]`, `/quotes/history`, `/quotes/[quoteId]`,
 * `/mover/requests`, `/mover/quotes/[quoteId]`
 * 동작: GENERAL/DESIGNATED body → POST /api/chat/rooms → `/chat/{roomId}` 이동, 실패 시 토스트.
 * COMMUNITY `useCreateChatRoom`을 재사용한다.
 */
export const useStartEstimateChat = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: createChatRoom, isPending: isChatPending } =
    useCreateChatRoom();

  const startEstimateChat = useCallback(
    (params: StartEstimateChatParams) => {
      if (isChatPending) {
        return;
      }

      const body = buildEstimateChatRoomBody(params);

      if (!body) {
        showToast({ content: '채팅방을 열지 못했습니다.' });
        return;
      }

      createChatRoom(body, {
        onSuccess: (response) => {
          router.push(`/chat/${response.data.roomId}`);
        },
        onError: (error) => {
          showToast({
            content: resolveApiErrorMessage(error, '채팅방을 열지 못했습니다.'),
          });
        },
      });
    },
    [createChatRoom, isChatPending, router, showToast]
  );

  return {
    startEstimateChat,
    isChatPending,
  };
};

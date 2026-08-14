'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useCreateChatRoom } from '@/hooks/useChat';
import { useToast } from '@/hooks/useToast';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  buildEstimateChatRoomBody,
  toStartEstimateChatParams,
  type BuildEstimateChatRoomBodyParams,
  type StartEstimateChatSource,
} from '@/lib/startEstimateChat';

export type StartEstimateChatParams = BuildEstimateChatRoomBodyParams;

/**
 * 견적·지정 플로우 공통 채팅 시작 훅 (#162).
 * 사용 화면: `/quotes` 대기카드, `/movers/[id]`, `/quotes/history`, `/quotes/[quoteId]`,
 * `/mover/requests`, `/mover/quotes/[quoteId]`
 * 동작: GENERAL/DESIGNATED body → POST /api/chat/rooms → `/chat/{roomId}` 이동, 실패 시 토스트.
 * `targetId`를 넘기면 해당 카드만 pending UI에 쓸 `pendingChatTargetId`를 유지한다.
 * COMMUNITY `useCreateChatRoom`을 재사용한다.
 */
export const useStartEstimateChat = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: createChatRoom, isPending: isChatPending } =
    useCreateChatRoom();
  /** 목록에서 "연결 중..."을 표시할 카드/요청 id */
  const [pendingChatTargetId, setPendingChatTargetId] = useState<number | null>(
    null
  );

  const startEstimateChat = useCallback(
    (params: StartEstimateChatParams, targetId?: number) => {
      if (isChatPending) {
        return;
      }

      const body = buildEstimateChatRoomBody(params);

      if (!body) {
        showToast({ content: '채팅방을 열지 못했습니다.' });
        return;
      }

      if (targetId != null) {
        setPendingChatTargetId(targetId);
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
        onSettled: () => {
          setPendingChatTargetId(null);
        },
      });
    },
    [createChatRoom, isChatPending, router, showToast]
  );

  /** 견적·요청 모델 + moverId로 채팅 시작. moverId가 없으면 no-op */
  const startEstimateChatFromSource = useCallback(
    (
      source: StartEstimateChatSource,
      moverId: string | null | undefined,
      targetId?: number
    ) => {
      if (!moverId) {
        return;
      }

      startEstimateChat(toStartEstimateChatParams(source, moverId), targetId);
    },
    [startEstimateChat]
  );

  return {
    startEstimateChat,
    startEstimateChatFromSource,
    isChatPending,
    pendingChatTargetId,
  };
};

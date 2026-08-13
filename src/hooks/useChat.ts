'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { ApiError } from '@/lib/apiClient';
import {
  createChatRoom,
  getChatMessages,
  getChatRoom,
  getChatRooms,
  getChatUnreadCount,
  leaveChatRoom,
  markChatRoomAsRead,
  sendChatMessage,
} from '@/services/chatApi';
import type {
  ChatMessage,
  ChatMessagesResponse,
  ChatRoomDetailResponse,
  ChatRoomListItem,
  ChatRoomListResponse,
  CreateChatRoomRequest,
  LeaveChatRoomResponse,
  MarkChatRoomAsReadRequest,
  SendChatMessageRequest,
} from '@/types/chat';

/** 메시지 이력 기본 page size (BE default와 동일) */
const DEFAULT_MESSAGES_LIMIT = 30;

export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  room: (roomId: number) => [...chatQueryKeys.all, 'room', roomId] as const,
  messages: (roomId: number) =>
    [...chatQueryKeys.all, 'messages', roomId] as const,
  unread: () => [...chatQueryKeys.all, 'unread'] as const,
};

const isValidRoomId = (roomId: number): boolean =>
  Number.isFinite(roomId) && roomId > 0;

/**
 * BE는 페이지 내 메시지를 id desc(최신→과거)로 반환한다.
 * InfiniteQuery pages[0] = 최신 배치이므로, 페이지를 뒤집은 뒤 각 페이지를 오름차순으로 펼친다.
 * messageId 기준 중복은 제거한다(REST·소켓 레이스 잔여 방어).
 */
const flattenMessagesChronological = (
  pages: ChatMessagesResponse[] | undefined
): ChatMessage[] => {
  if (!pages?.length) {
    return [];
  }

  const seen = new Set<number>();
  const chronological = [...pages]
    .reverse()
    .flatMap((page) => [...page.data.messages].reverse());

  return chronological.filter((message) => {
    if (seen.has(message.messageId)) {
      return false;
    }
    seen.add(message.messageId);
    return true;
  });
};

/** GET /api/chat/rooms — 채팅방 목록 */
export const useChatRooms = (options?: { enabled?: boolean }) => {
  const query = useQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: getChatRooms,
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });

  const rooms = query.data?.data.rooms ?? [];

  return {
    ...query,
    rooms,
    isEmpty: !query.isPending && !query.isError && rooms.length === 0,
  };
};

/** GET /api/chat/rooms/:roomId — 채팅방 상세 */
export const useChatRoom = (
  roomId: number,
  options?: { enabled?: boolean }
) => {
  const enabled = (options?.enabled ?? true) && isValidRoomId(roomId);

  const query = useQuery({
    queryKey: chatQueryKeys.room(roomId),
    queryFn: () => getChatRoom(roomId),
    enabled,
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    room: query.data?.data ?? null,
  };
};

/** GET /api/chat/unread-count — 전체 미읽음 수 */
export const useChatUnreadCount = (options?: { enabled?: boolean }) => {
  const query = useQuery({
    queryKey: chatQueryKeys.unread(),
    queryFn: getChatUnreadCount,
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });

  return {
    ...query,
    unreadCount: query.data?.data.unreadCount ?? 0,
  };
};

/**
 * GET /api/chat/rooms/:roomId/messages — 메시지 무한 스크롤.
 * pageParam = before(messageId). 첫 페이지는 before 없이 최신 배치.
 */
export const useChatMessages = (
  roomId: number,
  options?: { enabled?: boolean; limit?: number }
) => {
  const limit = options?.limit ?? DEFAULT_MESSAGES_LIMIT;
  const enabled = (options?.enabled ?? true) && isValidRoomId(roomId);

  const query = useInfiniteQuery({
    queryKey: chatQueryKeys.messages(roomId),
    queryFn: ({ pageParam }) =>
      getChatMessages(roomId, {
        before: pageParam,
        limit,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNext
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    enabled,
  });

  const messages = useMemo(
    () => flattenMessagesChronological(query.data?.pages),
    [query.data?.pages]
  );

  return {
    ...query,
    messages,
    isEmpty: !query.isPending && !query.isError && messages.length === 0,
  };
};

/** POST /api/chat/rooms — 방 생성(또는 기존 방 반환) */
export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateChatRoomRequest) => createChatRoom(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

/** 방 목록 캐시 공통 갱신 (null 가드 + rooms transform) */
const updateRoomsListCache = (
  queryClient: QueryClient,
  transform: (rooms: ChatRoomListItem[]) => ChatRoomListItem[]
) => {
  queryClient.setQueryData<ChatRoomListResponse>(
    chatQueryKeys.rooms(),
    (current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        data: { rooms: transform(current.data.rooms) },
      };
    }
  );
};

/** 전송 성공 시 메시지·목록 캐시 갱신 */
const applySentMessageToCaches = (
  queryClient: QueryClient,
  roomId: number,
  message: ChatMessage
) => {
  queryClient.setQueryData<InfiniteData<ChatMessagesResponse>>(
    chatQueryKeys.messages(roomId),
    (current) => {
      if (!current?.pages.length) {
        return {
          pages: [
            {
              data: { messages: [message] },
              meta: { hasNext: false, nextCursor: null },
            },
          ],
          pageParams: [undefined],
        };
      }

      // 소켓 chat:message 에코가 먼저 반영된 경우 중복 prepend 방지
      const alreadyExists = current.pages.some((page) =>
        page.data.messages.some((item) => item.messageId === message.messageId)
      );
      if (alreadyExists) {
        return current;
      }

      const [firstPage, ...restPages] = current.pages;

      return {
        ...current,
        pages: [
          {
            ...firstPage,
            data: {
              messages: [message, ...firstPage.data.messages],
            },
          },
          ...restPages,
        ],
      };
    }
  );

  const roomsCache = queryClient.getQueryData<ChatRoomListResponse>(
    chatQueryKeys.rooms()
  );
  const hasRoomInList = roomsCache?.data.rooms.some(
    (room) => room.roomId === roomId
  );

  // REST 전송만으로도 상대 재참여가 일어나므로 소켓 미연결 시에도 나감 표시를 해제한다.
  queryClient.setQueryData<ChatRoomDetailResponse>(
    chatQueryKeys.room(roomId),
    (current) => {
      if (!current?.data.isPartnerLeft) {
        return current;
      }

      return {
        ...current,
        data: {
          ...current.data,
          isPartnerLeft: false,
          partnerLeftAt: null,
        },
      };
    }
  );

  // 목록에 아직 없는 방(생성 직후 등)은 캐시 패치 대신 목록 재조회로 동기화
  if (!hasRoomInList) {
    void queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    return;
  }

  const lastMessage = {
    messageId: message.messageId,
    senderId: message.senderId,
    content: message.content,
    messageType: message.messageType,
    createdAt: message.createdAt,
  };

  updateRoomsListCache(queryClient, (rooms) => {
    const target = rooms.find((room) => room.roomId === roomId);
    if (!target) {
      return rooms;
    }

    const others = rooms.filter((room) => room.roomId !== roomId);
    return [{ ...target, lastMessage }, ...others];
  });
};

/** POST /api/chat/rooms/:roomId/messages — TEXT/IMAGE 전송 */
export const useSendChatMessage = (roomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendChatMessageRequest) => sendChatMessage(roomId, body),
    onSuccess: (response) => {
      applySentMessageToCaches(queryClient, roomId, response.data);
    },
  });
};

/** POST /api/chat/rooms/:roomId/read — 읽음 처리 */
export const useMarkChatRoomAsRead = (roomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MarkChatRoomAsReadRequest) =>
      markChatRoomAsRead(roomId, body),
    // 멱등 API — 일시 실패 시 제한 재시도 (UI effect 재호출에 의존하지 않음)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    onSuccess: async () => {
      updateRoomsListCache(queryClient, (rooms) =>
        rooms.map((room) =>
          room.roomId === roomId ? { ...room, unreadCount: 0 } : room
        )
      );

      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.unread() });
    },
  });
};

const isAlreadyLeftError = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) {
    return false;
  }
  // code가 있으면 ALREADY_LEFT만 인정. 다른 409(CONFLICT 등)는 성공으로 취급하지 않는다.
  if (error.code) {
    return error.code === 'ALREADY_LEFT';
  }
  return error.status === 409;
};

/**
 * 나가기 성공 시 목록에서만 즉시 제거한다.
 * room/messages는 ChatRoomPage observer가 아직 살아 있어 removeQueries 시
 * 나간 방을 재조회하므로, 목록 정리만 하고 상세·메시지 캐시는 라우트 이탈 후 GC에 맡긴다.
 */
const removeLeftRoomFromCache = (
  queryClient: QueryClient,
  roomId: number
): void => {
  updateRoomsListCache(queryClient, (rooms) =>
    rooms.filter((room) => room.roomId !== roomId)
  );

  void queryClient.cancelQueries({ queryKey: chatQueryKeys.room(roomId) });
  void queryClient.cancelQueries({ queryKey: chatQueryKeys.messages(roomId) });
};

/** POST /api/chat/rooms/:roomId/leave — 나가기 (409 ALREADY_LEFT는 성공으로 취급) */
export const useLeaveChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: number): Promise<LeaveChatRoomResponse | null> => {
      try {
        return await leaveChatRoom(roomId);
      } catch (error) {
        if (isAlreadyLeftError(error)) {
          return null;
        }
        throw error;
      }
    },
    onSuccess: async (_data, roomId) => {
      removeLeftRoomFromCache(queryClient, roomId);
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.unread() });
    },
  });
};

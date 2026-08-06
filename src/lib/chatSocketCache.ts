import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import { chatQueryKeys } from '@/hooks/useChat';
import type {
  ChatMessage,
  ChatMessagesResponse,
  ChatRoomListItem,
  ChatRoomListResponse,
  ChatSocketMessagePayload,
  ChatSocketUnreadPayload,
  ChatUnreadCountResponse,
} from '@/types/chat';

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

const hasRoomInRoomsCache = (
  queryClient: QueryClient,
  roomId: number
): boolean => {
  const roomsCache = queryClient.getQueryData<ChatRoomListResponse>(
    chatQueryKeys.rooms()
  );
  return Boolean(
    roomsCache?.data.rooms.some((room) => room.roomId === roomId)
  );
};

/**
 * 목록에 없는 방(나가기 후 재참여 등)이면 rooms를 즉시 재조회한다.
 * invalidate만 하면 observer/타이밍에 따라 첫 이벤트가 목록에 안 잡힐 수 있다.
 */
const syncRoomsListIfMissing = (
  queryClient: QueryClient,
  roomId: number
): boolean => {
  if (hasRoomInRoomsCache(queryClient, roomId)) {
    return true;
  }

  void queryClient.refetchQueries({ queryKey: chatQueryKeys.rooms() });
  return false;
};

/** 새 메시지를 맨 앞에 넣는 함수 */
const prependMessageToInfiniteCache = (
  queryClient: QueryClient,
  roomId: number,
  message: ChatMessage
) => {
  queryClient.setQueryData<InfiniteData<ChatMessagesResponse>>(
    chatQueryKeys.messages(roomId),
    (current) => {
      // 방을 아직 조회하지 않았다면 캐시를 만들지 않는다. 최초 조회는 서버 이력을 사용한다.
      // 단, 나가기 후 재참여 첫 메시지는 아래 seed 경로에서 별도 처리한다.
      if (!current?.pages.length) {
        return current;
      }

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
};

/**
 * 메시지 캐시가 없을 때(나가기 후 removeQueries) 소켓 첫 메시지로 seed한다.
 * 방 진입 전·직후에도 대화가 비어 보이지 않게 한다.
 */
const seedMessagesCacheIfEmpty = (
  queryClient: QueryClient,
  roomId: number,
  message: ChatMessage
) => {
  const current = queryClient.getQueryData<InfiniteData<ChatMessagesResponse>>(
    chatQueryKeys.messages(roomId)
  );

  if (current?.pages.length) {
    return;
  }

  queryClient.setQueryData<InfiniteData<ChatMessagesResponse>>(
    chatQueryKeys.messages(roomId),
    {
      pages: [
        {
          data: { messages: [message] },
          meta: { hasNext: false, nextCursor: null },
        },
      ],
      pageParams: [undefined],
    }
  );
};

/**
 * `chat:message` — 메시지 infinite cache prepend + 목록 lastMessage/정렬.
 * REST 전송 직후 소켓 에코와 중복될 수 있어 messageId로 멱등 처리한다.
 */
export const applySocketMessageToCaches = (
  queryClient: QueryClient,
  payload: ChatSocketMessagePayload
): void => {
  const { roomId, message } = payload;

  prependMessageToInfiniteCache(queryClient, roomId, message);

  const isRoomVisible = syncRoomsListIfMissing(queryClient, roomId);

  if (!isRoomVisible) {
    // 나가기 후 재참여 첫 메시지: 목록 refetch + 메시지 seed
    seedMessagesCacheIfEmpty(queryClient, roomId, message);
    return;
  }

  const lastMessage = {
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

/**
 * `chat:unread` — 전체 unread + (있으면) room별 unreadCount.
 * 방 진입 시 BE가 roomUnreadCount: 0으로 맞춰 줄 때도 동일 경로를 탄다.
 *
 * 나가기 후 재참여처럼 목록에 방이 없으면 unread만 올리고 끝내면
 * 뱃지만 갱신되고 목록/방 진입이 안 되므로 rooms를 재조회한다.
 */
export const applySocketUnreadToCaches = (
  queryClient: QueryClient,
  payload: ChatSocketUnreadPayload
): void => {
  queryClient.setQueryData<ChatUnreadCountResponse>(
    chatQueryKeys.unread(),
    (current) => {
      if (!current) {
        return {
          data: { unreadCount: payload.unreadCount },
        };
      }

      return {
        ...current,
        data: { unreadCount: payload.unreadCount },
      };
    }
  );

  if (
    typeof payload.roomId === 'number' &&
    typeof payload.roomUnreadCount === 'number'
  ) {
    const { roomId, roomUnreadCount } = payload;

    if (!hasRoomInRoomsCache(queryClient, roomId)) {
      void queryClient.refetchQueries({ queryKey: chatQueryKeys.rooms() });
      return;
    }

    updateRoomsListCache(queryClient, (rooms) =>
      rooms.map((room) =>
        room.roomId === roomId
          ? { ...room, unreadCount: roomUnreadCount }
          : room
      )
    );
  }
};

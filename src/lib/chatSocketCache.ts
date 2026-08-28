import { chatQueryKeys } from '@/constants/queryKey';
import { updateRoomsListCache } from '@/lib/chatQueryCache';
import { applyLastMessageToChatRoomsList } from '@/lib/chatRoomListSort';

import type {
  ChatMessage,
  ChatMessagesResponse,
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  ChatSocketMessagePayload,
  ChatSocketPartnerLeftPayload,
  ChatSocketReadPayload,
  ChatSocketUnreadPayload,
  ChatUnreadCountResponse,
} from '@/types/chat';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

/** 재참여 직후 message/unread가 연달아 올 때 rooms 중복 refetch 방지 */
const ROOMS_REFETCH_COOLDOWN_MS = 1500;

let roomsRefetchInFlight: Promise<unknown> | null = null;
let lastRoomsRefetchAt = 0;

const hasRoomInRoomsCache = (
  queryClient: QueryClient,
  roomId: number
): boolean => {
  const roomsCache = queryClient.getQueryData<ChatRoomListResponse>(
    chatQueryKeys.rooms()
  );
  return Boolean(roomsCache?.data.rooms.some((room) => room.roomId === roomId));
};

const refetchRoomsList = (queryClient: QueryClient): void => {
  const now = Date.now();
  if (roomsRefetchInFlight) {
    return;
  }
  if (now - lastRoomsRefetchAt < ROOMS_REFETCH_COOLDOWN_MS) {
    return;
  }

  lastRoomsRefetchAt = now;
  roomsRefetchInFlight = queryClient
    .refetchQueries({ queryKey: chatQueryKeys.rooms() })
    .finally(() => {
      roomsRefetchInFlight = null;
    });
};

/** 방 상세 상대 나감 캐시 패치 값 (#275) */
interface PartnerLeftState {
  isPartnerLeft: boolean;
  partnerLeftAt: string | null;
}

/** 방 상세의 상대 나감 플래그를 갱신한다 (#275). */
const patchRoomPartnerLeft = (
  queryClient: QueryClient,
  roomId: number,
  next: PartnerLeftState,
  /** 나감 해제 시, 이 시각 이후 나간 상태면 캐시를 유지한다 */
  clearedAsOf?: string
): void => {
  queryClient.setQueryData<ChatRoomDetailResponse>(
    chatQueryKeys.roomDetail(roomId),
    (current) => {
      if (!current) {
        return current;
      }

      if (
        !next.isPartnerLeft &&
        clearedAsOf &&
        current.data.isPartnerLeft &&
        current.data.partnerLeftAt &&
        Date.parse(current.data.partnerLeftAt) > Date.parse(clearedAsOf)
      ) {
        return current;
      }

      if (
        current.data.isPartnerLeft === next.isPartnerLeft &&
        current.data.partnerLeftAt === next.partnerLeftAt
      ) {
        return current;
      }

      return {
        ...current,
        data: {
          ...current.data,
          isPartnerLeft: next.isPartnerLeft,
          partnerLeftAt: next.partnerLeftAt,
        },
      };
    }
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

  refetchRoomsList(queryClient);
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
 * 메시지 캐시가 없을 때(나가기 후) 소켓 첫 메시지로 임시 seed한다.
 * hasNext는 소진으로 표시하지 않고, 곧바로 invalidate해 서버 이력·페이지네이션을 맞춘다.
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
          // before 커서 = 이 messageId → 이전 이력 로드 가능
          meta: { hasNext: true, nextCursor: message.messageId },
        },
      ],
      pageParams: [undefined],
    }
  );

  void queryClient.invalidateQueries({
    queryKey: chatQueryKeys.messages(roomId),
  });
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

  // 메시지 전송 시 BE가 나간 상대를 재참여시키므로 나감 표시를 해제한다.
  // 전송 이후 상대가 다시 나간 최신 상태는 덮어쓰지 않는다.
  patchRoomPartnerLeft(
    queryClient,
    roomId,
    {
      isPartnerLeft: false,
      partnerLeftAt: null,
    },
    message.createdAt
  );

  const isRoomVisible = syncRoomsListIfMissing(queryClient, roomId);

  if (!isRoomVisible) {
    // 나가기 후 재참여 첫 메시지: 목록 refetch + 메시지 seed
    seedMessagesCacheIfEmpty(queryClient, roomId, message);
    return;
  }

  const lastMessage = {
    messageId: message.messageId,
    senderId: message.senderId,
    content: message.content,
    messageType: message.messageType,
    createdAt: message.createdAt,
  };

  updateRoomsListCache(queryClient, (rooms) =>
    applyLastMessageToChatRoomsList(rooms, roomId, lastMessage)
  );
};

/**
 * `chat:read` — 상대 읽음 커서를 방 상세 캐시에 전진만 반영한다.
 * 본인(readerId === currentUserId) 이벤트는 무시한다.
 */
export const applySocketReadToCaches = (
  queryClient: QueryClient,
  payload: ChatSocketReadPayload,
  currentUserId: string
): void => {
  if (payload.readerId === currentUserId) {
    return;
  }

  const { roomId, lastReadMessageId } = payload;

  queryClient.setQueryData<ChatRoomDetailResponse>(
    chatQueryKeys.roomDetail(roomId),
    (current) => {
      if (!current) {
        return current;
      }

      const previous = current.data.partnerLastReadMessageId;

      // 읽은 커서는 앞으로만 이동
      if (previous != null && lastReadMessageId <= previous) {
        return current;
      }

      return {
        ...current,
        data: {
          ...current.data,
          partnerLastReadMessageId: lastReadMessageId,
          partnerLastReadAt: payload.readAt,
        },
      };
    }
  );

  updateRoomsListCache(queryClient, (rooms) =>
    rooms.map((room) => {
      if (room.roomId !== roomId) {
        return room;
      }

      const previous = room.partnerLastReadMessageId;
      if (previous != null && lastReadMessageId <= previous) {
        return room;
      }

      return {
        ...room,
        partnerLastReadMessageId: lastReadMessageId,
        partnerLastReadAt: payload.readAt,
      };
    })
  );
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
      refetchRoomsList(queryClient);
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

/**
 * `chat:partner-left` — 방 상세 캐시에 상대 나감 상태를 반영한다 (#275).
 */
export const applySocketPartnerLeftToCaches = (
  queryClient: QueryClient,
  payload: ChatSocketPartnerLeftPayload
): void => {
  patchRoomPartnerLeft(queryClient, payload.roomId, {
    isPartnerLeft: true,
    partnerLeftAt: payload.leftAt,
  });
};

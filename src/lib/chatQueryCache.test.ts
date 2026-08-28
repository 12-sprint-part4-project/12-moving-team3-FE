import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { chatQueryKeys } from '@/constants/queryKey';

import {
  invalidateChatRoomListAndDetails,
  updateRoomsListCache,
} from './chatQueryCache';

import type { ChatRoomListItem, ChatRoomListResponse } from '@/types/chat';

const createRoom = (roomId: number): ChatRoomListItem => ({
  roomId,
  roomType: 'GENERAL',
  quoteStatus: null,
  estimateRequestStatus: null,
  partner: {
    id: 'partner',
    userType: 'MOVER',
    name: '김기사',
    nickname: '기사',
    displayName: '김기사',
    profileImageUrl: null,
  },
  lastMessage: null,
  lastActivityAt: '2026-08-01T00:00:00.000Z',
  partnerLastReadMessageId: null,
  partnerLastReadAt: null,
  unreadCount: 0,
});

const createListResponse = (rooms: ChatRoomListItem[]): ChatRoomListResponse => ({
  data: { rooms },
});

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient();
});

describe('updateRoomsListCache', () => {
  it('캐시가 없으면 변경하지 않는다', () => {
    updateRoomsListCache(queryClient, (rooms) =>
      rooms.map((room) => ({ ...room, unreadCount: 99 }))
    );

    expect(queryClient.getQueryData(chatQueryKeys.rooms())).toBeUndefined();
  });

  it('rooms transform 결과를 캐시에 반영한다', () => {
    queryClient.setQueryData(
      chatQueryKeys.rooms(),
      createListResponse([createRoom(1), createRoom(2)])
    );

    updateRoomsListCache(queryClient, (rooms) =>
      rooms.map((room) =>
        room.roomId === 1 ? { ...room, unreadCount: 5 } : room
      )
    );

    const updated = queryClient.getQueryData<ChatRoomListResponse>(
      chatQueryKeys.rooms()
    );
    expect(updated?.data.rooms[0].unreadCount).toBe(5);
    expect(updated?.data.rooms[1].unreadCount).toBe(0);
  });
});

describe('invalidateChatRoomListAndDetails', () => {
  it('rooms·roomDetails queryKey를 invalidate한다', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await invalidateChatRoomListAndDetails(queryClient);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: chatQueryKeys.rooms(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: chatQueryKeys.roomDetails(),
    });
  });
});

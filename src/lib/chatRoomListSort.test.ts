import { describe, expect, it } from 'vitest';

import {
  applyLastMessageToChatRoomsList,
  compareChatRoomsByLastActivityDesc,
  compareChatRoomsForGnbPreviewDesc,
  patchChatRoomWithLastMessage,
  sortChatRoomsByLastActivity,
  sortChatRoomsForGnbPreview,
} from './chatRoomListSort';

import type { ChatLastMessage, ChatRoomListItem } from '@/types/chat';

const createRoom = (
  roomId: number,
  lastActivityAt: string,
  unreadCount = 0,
  lastMessage: ChatLastMessage | null = null
): ChatRoomListItem => ({
  roomId,
  roomType: 'GENERAL',
  quoteStatus: null,
  partner: {
    id: 'partner',
    userType: 'MOVER',
    name: '김기사',
    nickname: '기사',
    displayName: '김기사',
    profileImageUrl: null,
  },
  lastMessage,
  lastActivityAt,
  partnerLastReadMessageId: null,
  partnerLastReadAt: null,
  unreadCount,
});

describe('compareChatRoomsByLastActivityDesc', () => {
  it('lastActivityAt 내림차순, 동률 시 roomId 내림차순', () => {
    const rooms = [
      { roomId: 1, lastActivityAt: '2026-08-10T00:00:00.000Z' },
      { roomId: 3, lastActivityAt: '2026-08-10T00:00:00.000Z' },
      { roomId: 2, lastActivityAt: '2026-08-20T00:00:00.000Z' },
    ];

    rooms.sort(compareChatRoomsByLastActivityDesc);

    expect(rooms.map((room) => room.roomId)).toEqual([2, 3, 1]);
  });
});

describe('compareChatRoomsForGnbPreviewDesc', () => {
  it('unread 우선 후 lastActivityAt 정렬', () => {
    const rooms = [
      { roomId: 1, lastActivityAt: '2026-08-20T00:00:00.000Z', unreadCount: 0 },
      { roomId: 2, lastActivityAt: '2026-08-01T00:00:00.000Z', unreadCount: 3 },
      { roomId: 3, lastActivityAt: '2026-08-15T00:00:00.000Z', unreadCount: 1 },
    ];

    rooms.sort(compareChatRoomsForGnbPreviewDesc);

    expect(rooms.map((room) => room.roomId)).toEqual([3, 2, 1]);
  });
});

describe('sortChatRoomsByLastActivity', () => {
  it('lastActivityAt 내림차순으로 정렬한다', () => {
    const rooms = [
      createRoom(1, '2026-08-01T00:00:00.000Z'),
      createRoom(2, '2026-08-20T00:00:00.000Z'),
    ];

    const sorted = sortChatRoomsByLastActivity(rooms);

    expect(sorted.map((room) => room.roomId)).toEqual([2, 1]);
  });
});

describe('sortChatRoomsForGnbPreview', () => {
  it('unread 우선 정렬한다', () => {
    const rooms = [
      createRoom(1, '2026-08-20T00:00:00.000Z', 0),
      createRoom(2, '2026-08-01T00:00:00.000Z', 2),
    ];

    const sorted = sortChatRoomsForGnbPreview(rooms);

    expect(sorted.map((room) => room.roomId)).toEqual([2, 1]);
  });
});

describe('patchChatRoomWithLastMessage', () => {
  it('더 최신 메시지면 lastMessage·lastActivityAt을 갱신한다', () => {
    const room = createRoom(1, '2026-08-01T00:00:00.000Z');
    const incoming: ChatLastMessage = {
      messageId: 10,
      senderId: 'user',
      content: '새 메시지',
      messageType: 'TEXT',
      createdAt: '2026-08-20T00:00:00.000Z',
    };

    const patched = patchChatRoomWithLastMessage(room, incoming);

    expect(patched.lastMessage).toEqual(incoming);
    expect(patched.lastActivityAt).toBe('2026-08-20T00:00:00.000Z');
  });

  it('lastActivityAt보다 오래된 메시지는 무시한다', () => {
    const room = createRoom(1, '2026-08-20T00:00:00.000Z');
    const incoming: ChatLastMessage = {
      messageId: 5,
      senderId: 'user',
      content: '오래된 메시지',
      messageType: 'TEXT',
      createdAt: '2026-08-01T00:00:00.000Z',
    };

    const patched = patchChatRoomWithLastMessage(room, incoming);

    expect(patched).toBe(room);
  });

  it('lastActivityAt과 동일 시각·더 낮은 messageId 메시지는 무시한다', () => {
    const room = createRoom(1, '2026-08-20T00:00:00.000Z', 0, {
      messageId: 100,
      senderId: 'user',
      content: '기존 메시지',
      messageType: 'TEXT',
      createdAt: '2026-08-20T00:00:00.000Z',
    });
    const incoming: ChatLastMessage = {
      messageId: 99,
      senderId: 'user',
      content: '다른 메시지',
      messageType: 'TEXT',
      createdAt: '2026-08-20T00:00:00.000Z',
    };

    const patched = patchChatRoomWithLastMessage(room, incoming);

    expect(patched).toBe(room);
  });
});

describe('applyLastMessageToChatRoomsList', () => {
  it('해당 roomId만 갱신하고 lastActivityAt 순으로 재정렬한다', () => {
    const rooms = [
      createRoom(1, '2026-08-20T00:00:00.000Z'),
      createRoom(2, '2026-08-01T00:00:00.000Z'),
    ];
    const incoming: ChatLastMessage = {
      messageId: 99,
      senderId: 'user',
      content: '최신',
      messageType: 'TEXT',
      createdAt: '2026-08-25T00:00:00.000Z',
    };

    const updated = applyLastMessageToChatRoomsList(rooms, 2, incoming);

    expect(updated[0].roomId).toBe(2);
    expect(updated[0].lastMessage?.messageId).toBe(99);
    expect(updated[1].roomId).toBe(1);
  });
});

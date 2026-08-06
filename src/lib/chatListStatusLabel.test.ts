import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { getChatListStatusLabel } from '@/lib/chatListStatusLabel';
import type { ChatRoomListItem } from '@/types/chat';

const CURRENT_USER_ID = 'user-me';
const PARTNER_ID = 'user-partner';

const baseRoom = (): ChatRoomListItem => ({
  roomId: 1,
  roomType: 'GENERAL',
  partner: {
    id: PARTNER_ID,
    userType: 'MOVER',
    nickname: '기사님',
    profileImageUrl: null,
  },
  lastMessage: null,
  partnerLastReadMessageId: null,
  partnerLastReadAt: null,
  unreadCount: 0,
});

describe('getChatListStatusLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-06T12:00:00+09:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('마지막 메시지 없으면 빈 문자열', () => {
    expect(getChatListStatusLabel(baseRoom(), CURRENT_USER_ID)).toBe('');
  });

  it('상대 마지막 메시지 → 상대 시간(분 전)', () => {
    const room = baseRoom();
    room.lastMessage = {
      messageId: 10,
      senderId: PARTNER_ID,
      content: '안녕',
      messageType: 'TEXT',
      createdAt: '2026-08-06T11:57:00+09:00',
    };

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('3분 전');
  });

  it('내 메시지 + 상대 미읽음 → N분 전 보냄', () => {
    const room = baseRoom();
    room.lastMessage = {
      messageId: 20,
      senderId: CURRENT_USER_ID,
      content: '테스트',
      messageType: 'TEXT',
      createdAt: '2026-08-06T11:58:00+09:00',
    };
    room.partnerLastReadMessageId = 19;

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('2분 전 보냄');
  });

  it('내 메시지 + 상대 읽음 → N분 전 읽음', () => {
    const room = baseRoom();
    room.lastMessage = {
      messageId: 20,
      senderId: CURRENT_USER_ID,
      content: '테스트',
      messageType: 'TEXT',
      createdAt: '2026-08-06T11:58:00+09:00',
    };
    room.partnerLastReadMessageId = 20;
    room.partnerLastReadAt = '2026-08-06T11:59:00+09:00';

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('1분 전 읽음');
  });

  it('내 메시지 + 읽음 커서만 있고 readAt 없음 → 읽음 fallback', () => {
    const room = baseRoom();
    room.lastMessage = {
      messageId: 5,
      senderId: CURRENT_USER_ID,
      content: '오래됨',
      messageType: 'TEXT',
      createdAt: '2026-06-01T10:00:00+09:00',
    };
    room.partnerLastReadMessageId = 5;
    room.partnerLastReadAt = null;

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('읽음');
  });
});

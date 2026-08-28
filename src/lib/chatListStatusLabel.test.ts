import { describe, expect, it, vi } from 'vitest';

import { getChatListStatusLabel } from './chatListStatusLabel';

import type { ChatRoomListItem } from '@/types/chat';

vi.mock('@/lib/formatDate', () => ({
  formatRelativeTime: vi.fn((value: string) => `relative:${value}`),
  formatPartnerReadReceiptLabel: vi.fn(() => '방금 읽음'),
  formatMyMessageSentLabel: vi.fn(() => '방금 보냄'),
}));

const CURRENT_USER_ID = '11111111-1111-4111-8111-111111111111';
const PARTNER_ID = '22222222-2222-4222-8222-222222222222';

const createRoom = (
  overrides: Partial<ChatRoomListItem> = {}
): ChatRoomListItem => ({
  roomId: 1,
  roomType: 'GENERAL',
  quoteStatus: null,
  estimateRequestStatus: null,
  partner: {
    id: PARTNER_ID,
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
  ...overrides,
});

describe('getChatListStatusLabel', () => {
  it('lastMessage 없으면 빈 문자열', () => {
    expect(getChatListStatusLabel(createRoom(), CURRENT_USER_ID)).toBe('');
  });

  it('상대 메시지면 formatRelativeTime 결과', () => {
    const room = createRoom({
      lastMessage: {
        messageId: 10,
        senderId: PARTNER_ID,
        content: '안녕',
        messageType: 'TEXT',
        createdAt: '2026-08-20T00:00:00.000Z',
      },
    });

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe(
      'relative:2026-08-20T00:00:00.000Z'
    );
  });

  it('내 메시지·상대가 읽었으면 읽음 라벨', () => {
    const room = createRoom({
      lastMessage: {
        messageId: 10,
        senderId: CURRENT_USER_ID,
        content: '안녕',
        messageType: 'TEXT',
        createdAt: '2026-08-20T00:00:00.000Z',
      },
      partnerLastReadMessageId: 10,
      partnerLastReadAt: '2026-08-20T01:00:00.000Z',
    });

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('방금 읽음');
  });

  it('내 메시지·읽음 ID 없으면 보냄 라벨', () => {
    const room = createRoom({
      lastMessage: {
        messageId: 10,
        senderId: CURRENT_USER_ID,
        content: '안녕',
        messageType: 'TEXT',
        createdAt: '2026-08-20T00:00:00.000Z',
      },
    });

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('방금 보냄');
  });

  it('내 메시지·상대 미읽음이면 보냄 라벨', () => {
    const room = createRoom({
      lastMessage: {
        messageId: 10,
        senderId: CURRENT_USER_ID,
        content: '안녕',
        messageType: 'TEXT',
        createdAt: '2026-08-20T00:00:00.000Z',
      },
      partnerLastReadMessageId: 5,
    });

    expect(getChatListStatusLabel(room, CURRENT_USER_ID)).toBe('방금 보냄');
  });
});

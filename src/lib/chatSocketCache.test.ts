import { QueryClient, type InfiniteData } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { chatQueryKeys } from '@/constants/queryKey';

import {
  applySocketMessageToCaches,
  applySocketPartnerLeftToCaches,
  applySocketReadToCaches,
  applySocketUnreadToCaches,
} from './chatSocketCache';

import type {
  ChatMessage,
  ChatMessagesResponse,
  ChatRoomDetailResponse,
  ChatRoomListItem,
  ChatRoomListResponse,
  ChatUnreadCountResponse,
} from '@/types/chat';

const CURRENT_USER_ID = '11111111-1111-4111-8111-111111111111';
const PARTNER_ID = '22222222-2222-4222-8222-222222222222';
const ROOM_ID = 1;

const createPartner = () => ({
  id: PARTNER_ID,
  userType: 'MOVER' as const,
  name: '김기사',
  nickname: '기사',
  displayName: '김기사',
  profileImageUrl: null,
});

const createRoom = (
  overrides: Partial<ChatRoomListItem> = {}
): ChatRoomListItem => ({
  roomId: ROOM_ID,
  roomType: 'GENERAL',
  quoteStatus: null,
  estimateRequestStatus: null,
  partner: createPartner(),
  lastMessage: null,
  lastActivityAt: '2026-08-01T00:00:00.000Z',
  partnerLastReadMessageId: null,
  partnerLastReadAt: null,
  unreadCount: 0,
  ...overrides,
});

const createMessage = (
  overrides: Partial<ChatMessage> = {}
): ChatMessage => ({
  messageId: 100,
  senderId: PARTNER_ID,
  senderUserType: 'MOVER',
  messageType: 'TEXT',
  content: '안녕하세요',
  isFiltered: false,
  attachments: [],
  createdAt: '2026-08-20T00:00:00.000Z',
  ...overrides,
});

const createDetailResponse = (
  overrides: Partial<ChatRoomDetailResponse['data']> = {}
): ChatRoomDetailResponse => ({
  data: {
    roomType: 'GENERAL',
    partner: createPartner(),
    requestSummary: null,
    quoteId: null,
    quoteStatus: null,
    estimateRequestStatus: null,
    isMessagingAllowed: true,
    partnerLastReadMessageId: null,
    partnerLastReadAt: null,
    isPartnerLeft: false,
    partnerLeftAt: null,
    updatedAt: '2026-08-01T00:00:00.000Z',
    ...overrides,
  },
});

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient();
});

describe('applySocketReadToCaches', () => {
  it('본인 readerId 이벤트는 무시한다', () => {
    queryClient.setQueryData(
      chatQueryKeys.roomDetail(ROOM_ID),
      createDetailResponse()
    );
    queryClient.setQueryData(chatQueryKeys.rooms(), {
      data: {
        rooms: [
          createRoom({
            partnerLastReadMessageId: 10,
            partnerLastReadAt: '2026-08-19T00:00:00.000Z',
          }),
        ],
      },
    });

    applySocketReadToCaches(
      queryClient,
      {
        roomId: ROOM_ID,
        readerId: CURRENT_USER_ID,
        lastReadMessageId: 50,
        readAt: '2026-08-20T01:00:00.000Z',
      },
      CURRENT_USER_ID
    );

    const detail = queryClient.getQueryData<ChatRoomDetailResponse>(
      chatQueryKeys.roomDetail(ROOM_ID)
    );
    expect(detail?.data.partnerLastReadMessageId).toBeNull();

    const rooms = queryClient.getQueryData<ChatRoomListResponse>(
      chatQueryKeys.rooms()
    );
    expect(rooms?.data.rooms[0].partnerLastReadMessageId).toBe(10);
    expect(rooms?.data.rooms[0].partnerLastReadAt).toBe(
      '2026-08-19T00:00:00.000Z'
    );
  });

  it('상대 읽음 커서를 방 상세·목록에 전진 반영한다', () => {
    queryClient.setQueryData(
      chatQueryKeys.roomDetail(ROOM_ID),
      createDetailResponse({ partnerLastReadMessageId: 10 })
    );
    queryClient.setQueryData(chatQueryKeys.rooms(), {
      data: {
        rooms: [
          createRoom({
            partnerLastReadMessageId: 10,
            partnerLastReadAt: '2026-08-19T00:00:00.000Z',
          }),
        ],
      },
    });

    applySocketReadToCaches(
      queryClient,
      {
        roomId: ROOM_ID,
        readerId: PARTNER_ID,
        lastReadMessageId: 50,
        readAt: '2026-08-20T01:00:00.000Z',
      },
      CURRENT_USER_ID
    );

    const detail = queryClient.getQueryData<ChatRoomDetailResponse>(
      chatQueryKeys.roomDetail(ROOM_ID)
    );
    expect(detail?.data.partnerLastReadMessageId).toBe(50);
    expect(detail?.data.partnerLastReadAt).toBe('2026-08-20T01:00:00.000Z');

    const rooms = queryClient.getQueryData<ChatRoomListResponse>(
      chatQueryKeys.rooms()
    );
    expect(rooms?.data.rooms[0].partnerLastReadMessageId).toBe(50);
  });

  it('기존 커서보다 낮은 lastReadMessageId는 후퇴하지 않는다', () => {
    queryClient.setQueryData(
      chatQueryKeys.roomDetail(ROOM_ID),
      createDetailResponse({
        partnerLastReadMessageId: 50,
        partnerLastReadAt: '2026-08-20T01:00:00.000Z',
      })
    );
    queryClient.setQueryData(chatQueryKeys.rooms(), {
      data: {
        rooms: [
          createRoom({
            partnerLastReadMessageId: 50,
            partnerLastReadAt: '2026-08-20T01:00:00.000Z',
          }),
        ],
      },
    });

    applySocketReadToCaches(
      queryClient,
      {
        roomId: ROOM_ID,
        readerId: PARTNER_ID,
        lastReadMessageId: 30,
        readAt: '2026-08-20T00:30:00.000Z',
      },
      CURRENT_USER_ID
    );

    const detail = queryClient.getQueryData<ChatRoomDetailResponse>(
      chatQueryKeys.roomDetail(ROOM_ID)
    );
    expect(detail?.data.partnerLastReadMessageId).toBe(50);
    expect(detail?.data.partnerLastReadAt).toBe('2026-08-20T01:00:00.000Z');

    const rooms = queryClient.getQueryData<ChatRoomListResponse>(
      chatQueryKeys.rooms()
    );
    expect(rooms?.data.rooms[0].partnerLastReadMessageId).toBe(50);
    expect(rooms?.data.rooms[0].partnerLastReadAt).toBe(
      '2026-08-20T01:00:00.000Z'
    );
  });
});

describe('applySocketMessageToCaches', () => {
  it('목록 lastMessage·lastActivityAt과 메시지 캐시를 갱신한다', () => {
    const existingMessage = createMessage({
      messageId: 150,
      content: '기존 메시지',
    });
    queryClient.setQueryData(chatQueryKeys.rooms(), {
      data: { rooms: [createRoom()] },
    });
    queryClient.setQueryData<InfiniteData<ChatMessagesResponse>>(
      chatQueryKeys.messages(ROOM_ID),
      {
        pages: [
          {
            data: { messages: [existingMessage] },
            meta: { hasNext: false, nextCursor: null },
          },
        ],
        pageParams: [undefined],
      }
    );

    const message = createMessage({
      messageId: 200,
      content: '새 메시지',
      createdAt: '2026-08-25T00:00:00.000Z',
    });

    applySocketMessageToCaches(queryClient, { roomId: ROOM_ID, message });

    const messagesCache =
      queryClient.getQueryData<InfiniteData<ChatMessagesResponse>>(
        chatQueryKeys.messages(ROOM_ID)
      );
    expect(messagesCache?.pages[0].data.messages[0].messageId).toBe(200);
    expect(messagesCache?.pages[0].data.messages[1].messageId).toBe(150);

    const rooms = queryClient.getQueryData<ChatRoomListResponse>(
      chatQueryKeys.rooms()
    );
    expect(rooms?.data.rooms[0].lastMessage?.messageId).toBe(200);
    expect(rooms?.data.rooms[0].lastActivityAt).toBe('2026-08-25T00:00:00.000Z');
  });
});

describe('applySocketPartnerLeftToCaches', () => {
  it('방 상세에 isPartnerLeft·partnerLeftAt을 반영한다', () => {
    queryClient.setQueryData(
      chatQueryKeys.roomDetail(ROOM_ID),
      createDetailResponse()
    );

    applySocketPartnerLeftToCaches(queryClient, {
      roomId: ROOM_ID,
      leftAt: '2026-08-21T00:00:00.000Z',
    });

    const detail = queryClient.getQueryData<ChatRoomDetailResponse>(
      chatQueryKeys.roomDetail(ROOM_ID)
    );
    expect(detail?.data.isPartnerLeft).toBe(true);
    expect(detail?.data.partnerLeftAt).toBe('2026-08-21T00:00:00.000Z');
  });
});

describe('applySocketUnreadToCaches', () => {
  it('전체 unreadCount를 갱신한다', () => {
    queryClient.setQueryData(chatQueryKeys.unread(), {
      data: { unreadCount: 1 },
    });

    applySocketUnreadToCaches(queryClient, { unreadCount: 5 });

    const unread = queryClient.getQueryData<ChatUnreadCountResponse>(
      chatQueryKeys.unread()
    );
    expect(unread?.data.unreadCount).toBe(5);
  });

  it('roomUnreadCount가 있으면 목록 unreadCount도 갱신한다', () => {
    queryClient.setQueryData(chatQueryKeys.rooms(), {
      data: { rooms: [createRoom({ unreadCount: 0 })] },
    });

    applySocketUnreadToCaches(queryClient, {
      unreadCount: 3,
      roomId: ROOM_ID,
      roomUnreadCount: 2,
    });

    const rooms = queryClient.getQueryData<ChatRoomListResponse>(
      chatQueryKeys.rooms()
    );
    expect(rooms?.data.rooms[0].unreadCount).toBe(2);
  });

  it('목록에 방이 없으면 rooms를 refetch한다', () => {
    queryClient.setQueryData(chatQueryKeys.rooms(), {
      data: { rooms: [createRoom({ roomId: 999 })] },
    });
    const refetchSpy = vi.spyOn(queryClient, 'refetchQueries');

    applySocketUnreadToCaches(queryClient, {
      unreadCount: 3,
      roomId: ROOM_ID,
      roomUnreadCount: 2,
    });

    expect(refetchSpy).toHaveBeenCalledWith({
      queryKey: chatQueryKeys.rooms(),
    });
  });
});

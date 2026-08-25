'use client';

import { fn } from 'storybook/test';

import { PROFANITY_MESSAGE } from '@/lib/chatFilterTokens';

import { ChatMessageItem } from './ChatMessageItem';

import type { ChatMessage } from '@/types/chat';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const TEXT_PARTNER_MESSAGE: ChatMessage = {
  messageId: 101,
  senderId: 'partner-user-id',
  senderUserType: 'MOVER',
  messageType: 'TEXT',
  content: '안녕하세요, 견적 관련해서 문의드립니다.',
  isFiltered: false,
  attachments: [],
  createdAt: '2026-08-08T10:00:00.000Z',
};

const SHORT_PARTNER_MESSAGE: ChatMessage = {
  messageId: 104,
  senderId: 'partner-user-id',
  senderUserType: 'MOVER',
  messageType: 'TEXT',
  content: 'ㅋㅋㅋㅋㅋㅎ',
  isFiltered: false,
  attachments: [],
  createdAt: '2026-08-08T10:00:30.000Z',
};

const LONG_PARTNER_MESSAGE: ChatMessage = {
  messageId: 105,
  senderId: 'partner-user-id',
  senderUserType: 'MOVER',
  messageType: 'TEXT',
  content:
    'dsafasdf\nasdfasdf\n18:35\neeeeeee\ndsafasdf asdfasdf eeeeeee',
  isFiltered: false,
  attachments: [],
  createdAt: '2026-08-08T10:00:45.000Z',
};

const WARNING_PARTNER_MESSAGE: ChatMessage = {
  messageId: 106,
  senderId: 'partner-user-id',
  senderUserType: 'MOVER',
  messageType: 'TEXT',
  content: PROFANITY_MESSAGE,
  isFiltered: true,
  attachments: [],
  createdAt: '2026-08-08T10:00:50.000Z',
};

const IMAGE_PARTNER_MESSAGE: ChatMessage = {
  messageId: 102,
  senderId: 'partner-user-id',
  senderUserType: 'MOVER',
  messageType: 'IMAGE',
  content: '',
  isFiltered: false,
  attachments: [
    'https://picsum.photos/seed/chat-report-1/400/400',
    'https://picsum.photos/seed/chat-report-2/400/400',
  ],
  createdAt: '2026-08-08T10:01:00.000Z',
};

const IMAGE_URLS = [
  'https://picsum.photos/seed/chat-img-1/400/400',
  'https://picsum.photos/seed/chat-img-2/400/400',
  'https://picsum.photos/seed/chat-img-3/400/400',
  'https://picsum.photos/seed/chat-img-4/400/400',
  'https://picsum.photos/seed/chat-img-5/400/400',
] as const;

const createImageMessage = (
  messageId: number,
  count: number
): ChatMessage => ({
  messageId,
  senderId: 'partner-user-id',
  senderUserType: 'MOVER',
  messageType: 'IMAGE',
  content: '',
  isFiltered: false,
  attachments: IMAGE_URLS.slice(0, count).map((url) => url),
  createdAt: '2026-08-08T10:01:00.000Z',
});

const MINE_MESSAGE: ChatMessage = {
  messageId: 103,
  senderId: 'me-user-id',
  senderUserType: 'CUSTOMER',
  messageType: 'TEXT',
  content: '네, 확인했습니다.',
  isFiltered: false,
  attachments: [],
  createdAt: '2026-08-08T10:02:00.000Z',
};

const meta: Meta<typeof ChatMessageItem> = {
  title: 'Chat/ChatMessageItem',
  component: ChatMessageItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-md flex-col gap-4 bg-background-200 p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ChatMessageItem>;

/** 상대 텍스트 — 호버(또는 터치에서 연한 ⋯) → 신고 */
export const PartnerText: Story = {
  args: {
    message: TEXT_PARTNER_MESSAGE,
    isMine: false,
    showTime: true,
    onReport: fn(),
  },
};

/** 상대 짧은 글(시간 없음) — ⋯ 우하단 */
export const PartnerShortNoTime: Story = {
  args: {
    message: SHORT_PARTNER_MESSAGE,
    isMine: false,
    showTime: false,
    onReport: fn(),
  },
};

/** 상대 긴 글(시간 없음) — ⋯ 우하단 (짧은 글과 동일 앵커) */
export const PartnerLongNoTime: Story = {
  args: {
    message: LONG_PARTNER_MESSAGE,
    isMine: false,
    showTime: false,
    onReport: fn(),
  },
};

/** 상대 경고 문구 — ⋯·시간 우하단 (모바일=데스크톱) */
export const PartnerWarning: Story = {
  args: {
    message: WARNING_PARTNER_MESSAGE,
    isMine: false,
    showTime: true,
    onReport: fn(),
  },
};

/** 상대 이미지 — 동일 신고 메뉴 */
export const PartnerImage: Story = {
  args: {
    message: IMAGE_PARTNER_MESSAGE,
    isMine: false,
    showTime: true,
    onReport: fn(),
  },
};

/** 이미지 1장 */
export const PartnerImageOne: Story = {
  args: {
    message: createImageMessage(201, 1),
    isMine: false,
    showTime: true,
    onReport: fn(),
  },
};

/** 이미지 3장 — 위 2 + 아래 1(가로 full), 빈 칸 없음 */
export const PartnerImageThree: Story = {
  args: {
    message: createImageMessage(203, 3),
    isMine: false,
    showTime: true,
    onReport: fn(),
  },
};

/** 이미지 5장 — 2×2 + 아래 1(가로 full) */
export const PartnerImageFive: Story = {
  args: {
    message: createImageMessage(205, 5),
    isMine: false,
    showTime: true,
    onReport: fn(),
  },
};

/** 내 메시지 — onReport가 있어도 ⋯ 메뉴 없음 */
export const MineText: Story = {
  args: {
    message: MINE_MESSAGE,
    isMine: true,
    showTime: true,
    showUnreadCount: true,
    onReport: fn(),
  },
};

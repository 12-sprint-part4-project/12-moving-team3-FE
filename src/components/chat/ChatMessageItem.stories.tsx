'use client';

import { fn } from 'storybook/test';

import { ChatMessageItem } from '@/components/chat/ChatMessageItem';

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

/** 상대 이미지 — 동일 신고 메뉴 */
export const PartnerImage: Story = {
  args: {
    message: IMAGE_PARTNER_MESSAGE,
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

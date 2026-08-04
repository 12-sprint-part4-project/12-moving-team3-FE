'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ReviewMoverSummaryCard } from '@/components/reviews/ReviewMoverSummaryCard';

const meta: Meta<typeof ReviewMoverSummaryCard> = {
  title: 'Reviews/ReviewMoverSummaryCard',
  component: ReviewMoverSummaryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[38rem] bg-background-200 p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ReviewMoverSummaryCard>;

/** 기본 프로필 아이콘 */
export const Default: Story = {
  args: {
    moverName: '김코드',
    moveDate: '2024. 07. 01',
    quotePrice: '210,000원',
  },
};

/** 프로필 이미지 URL이 있는 경우 */
export const WithAvatar: Story = {
  args: {
    moverName: '이이사',
    moveDate: '2024. 07. 15',
    quotePrice: '450,000원',
    avatarSrc: 'https://i.pravatar.cc/112?img=12',
  },
};

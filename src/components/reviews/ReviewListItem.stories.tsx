'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ReviewListItem } from '@/components/reviews/ReviewListItem';

const meta: Meta<typeof ReviewListItem> = {
  title: 'Reviews/ReviewListItem',
  component: ReviewListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[37.5rem] bg-white px-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ReviewListItem>;

export const Default: Story = {
  args: {
    customerName: 'kim고객',
    createdAt: '2024-07-01T12:00:00.000Z',
    rating: 5,
    content:
      '기사님이 친절하시고 짐도 꼼꼼하게 옮겨주셨어요. 다음에도 부탁드리고 싶습니다.',
  },
};

export const PartialRating: Story = {
  args: {
    customerName: '이가입',
    createdAt: '2024-06-15T09:30:00.000Z',
    rating: 3,
    content: '전반적으로 괜찮았습니다.',
  },
};

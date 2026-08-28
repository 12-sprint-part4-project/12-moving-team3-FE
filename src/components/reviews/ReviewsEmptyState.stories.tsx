import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReviewsEmptyState> = {
  title: 'Reviews/ReviewsEmptyState',
  component: ReviewsEmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[20rem] bg-background-200">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ReviewsEmptyState>;

export const WritableEmpty: Story = {
  args: {
    message: '작성 가능한 리뷰가 없어요',
  },
};

export const WrittenEmpty: Story = {
  args: {
    message: '아직 작성한 리뷰가 없어요',
  },
};

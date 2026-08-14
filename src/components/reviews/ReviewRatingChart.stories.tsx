import {
  EMPTY_RATING_STATISTICS,
  SAMPLE_RATING_STATISTICS,
} from '@/components/reviews/_fixtures/reviewFixtures';
import { ReviewRatingChart } from '@/components/reviews/ReviewRatingChart';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReviewRatingChart> = {
  title: 'Reviews/ReviewRatingChart',
  component: ReviewRatingChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof ReviewRatingChart>;

export const Default: Story = {
  args: {
    statistics: SAMPLE_RATING_STATISTICS,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[60rem] bg-white p-6">
        <Story />
      </div>
    ),
  ],
};

export const EmptyStats: Story = {
  args: {
    statistics: EMPTY_RATING_STATISTICS,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[60rem] bg-white p-6">
        <Story />
      </div>
    ),
  ],
};

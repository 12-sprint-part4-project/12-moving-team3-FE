import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { StarRating } from './StarRating';

const meta: Meta<typeof StarRating> = {
  title: 'UI/StarRating',
  component: StarRating,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof StarRating>;

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Filled: Story = {
  args: {
    value: 4,
  },
};

export const Interactive: Story = {
  render: () => {
    const InteractiveStarRating = () => {
      const [value, setValue] = useState(0);
      return <StarRating value={value} onChange={setValue} />;
    };
    return <InteractiveStarRating />;
  },
};

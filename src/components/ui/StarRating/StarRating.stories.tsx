import { useState } from 'react';

import { StarRating } from './StarRating';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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

/** render 안에서 컴포넌트를 선언하면 리렌더링마다 타입이 바뀌어 remount되며 value 상태가 초기화되므로, 모듈 스코프로 분리한다. */
const InteractiveStarRating = () => {
  const [value, setValue] = useState(0);
  return <StarRating value={value} onChange={setValue} />;
};

export const Interactive: Story = {
  render: () => <InteractiveStarRating />,
};

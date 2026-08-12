import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState, type ComponentProps } from 'react';
import { fn } from 'storybook/test';

import { PriceInput } from './PriceInput';

const meta: Meta<typeof PriceInput> = {
  title: 'UI/Input/PriceInput',
  component: PriceInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem] rounded-2xl bg-gradient-to-r from-background-200 to-white p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    onValueChange: fn(),
    placeholder: '견적가 입력',
  },
};

export default meta;

type Story = StoryObj<typeof PriceInput>;

const InteractivePriceInput = (
  props: Omit<ComponentProps<typeof PriceInput>, 'value' | 'onValueChange'>
) => {
  const [value, setValue] = useState('');
  return <PriceInput {...props} value={value} onValueChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <InteractivePriceInput {...args} />,
};

export const WithError: Story = {
  render: () => (
    <InteractivePriceInput
      errorMessage="견적가는 1원 이상이어야 합니다."
      isError
    />
  ),
};

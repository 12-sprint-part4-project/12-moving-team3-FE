import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AddressChip } from './AddressChip';

const meta: Meta<typeof AddressChip> = {
  title: 'UI/Chip/AddressChip',
  component: AddressChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-background-200 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    children: '서울 강남구',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '칩 크기 (sm | md)',
    },
    children: {
      control: 'text',
      description: '표시할 주소 텍스트',
    },
  },
};
export default meta;

type Story = StoryObj<typeof AddressChip>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: '경기 성남시',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AddressChip size="sm">서울 강남구</AddressChip>
      <AddressChip size="md">서울 강남구</AddressChip>
    </div>
  ),
};

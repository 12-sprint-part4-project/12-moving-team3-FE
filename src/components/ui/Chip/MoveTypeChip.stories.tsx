import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MoveTypeChip } from './MoveTypeChip';

const meta: Meta<typeof MoveTypeChip> = {
  title: 'UI/Chip/MoveTypeChip',
  component: MoveTypeChip,
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
    type: 'small',
    size: 'sm',
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'small',
        'home',
        'office',
        'designated',
        'quotePending',
        'quoteConfirmed',
        'quoteRejected',
        'furnitureShare',
      ],
      description:
        '이사 유형/상태. small/home/office(파란), designated(빨간), 상태칩(대기/확정/반려)=회색·xs 없음, furnitureShare(노란)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md'],
      description: '크기. xs는 아이콘만 표시 (상태칩은 xs 없음)',
    },
    children: {
      control: 'text',
      description: '라벨. 미지정 시 type별 기본 라벨 사용',
    },
  },
};
export default meta;

type Story = StoryObj<typeof MoveTypeChip>;

export const SmallMove: Story = {
  args: {
    type: 'small',
    size: 'sm',
  },
};

export const HomeMove: Story = {
  args: {
    type: 'home',
    size: 'sm',
  },
};

export const OfficeMove: Story = {
  args: {
    type: 'office',
    size: 'sm',
  },
};

export const Designated: Story = {
  args: {
    type: 'designated',
    size: 'sm',
  },
};

export const QuotePending: Story = {
  args: {
    type: 'quotePending',
    size: 'sm',
  },
};

export const FurnitureShare: Story = {
  args: {
    type: 'furnitureShare',
    size: 'sm',
  },
};

export const IconOnly: Story = {
  args: {
    type: 'home',
    size: 'xs',
  },
};

export const CustomLabel: Story = {
  args: {
    type: 'small',
    size: 'md',
    children: '커스텀 라벨',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="small" size="xs" />
        <MoveTypeChip type="small" size="sm" />
        <MoveTypeChip type="small" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="home" size="xs" />
        <MoveTypeChip type="home" size="sm" />
        <MoveTypeChip type="home" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="office" size="xs" />
        <MoveTypeChip type="office" size="sm" />
        <MoveTypeChip type="office" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="designated" size="xs" />
        <MoveTypeChip type="designated" size="sm" />
        <MoveTypeChip type="designated" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="quotePending" size="sm" />
        <MoveTypeChip type="quotePending" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="quoteConfirmed" size="sm" />
        <MoveTypeChip type="quoteConfirmed" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="quoteRejected" size="sm" />
        <MoveTypeChip type="quoteRejected" size="md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MoveTypeChip type="furnitureShare" size="sm" />
        <MoveTypeChip type="furnitureShare" size="md" />
      </div>
    </div>
  ),
};

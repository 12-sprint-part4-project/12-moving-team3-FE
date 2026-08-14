import { useState } from 'react';
import { fn } from 'storybook/test';

import { RegionChip } from './RegionChip';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof RegionChip> = {
  title: 'UI/Chip/RegionChip',
  component: RegionChip,
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
    children: '서울',
    variant: 'button',
    isSelected: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['button', 'textOnly'],
      description:
        'button: 선택 가능한 버튼 / textOnly: 표시 전용 (Region은 항상 회색)',
    },
    isSelected: {
      control: 'boolean',
      description: 'button일 때 선택 여부. 선택 시 파란 스타일',
    },
    disabled: {
      control: 'boolean',
      description: 'button일 때 비활성화',
    },
    children: {
      control: 'text',
      description: '지역 라벨',
    },
  },
};
export default meta;

type Story = StoryObj<typeof RegionChip>;

export const ButtonUnselected: Story = {
  args: {
    variant: 'button',
    isSelected: false,
  },
};

export const ButtonSelected: Story = {
  args: {
    variant: 'button',
    isSelected: true,
  },
};

export const TextOnly: Story = {
  args: {
    variant: 'textOnly',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'button',
    disabled: true,
  },
};

function InteractiveDemo() {
  const regions = ['서울', '경기', '인천', '부산', '대구'] as const;
  const [selected, setSelected] = useState<string[]>(['서울']);

  const toggle = (region: string) => {
    setSelected((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  return (
    <div className="flex w-80 flex-col gap-4">
      <p className="text-md-medium text-black-400">
        선택:{' '}
        <span className="text-black-500">
          {selected.length > 0 ? selected.join(', ') : '없음'}
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <RegionChip
            key={region}
            variant="button"
            isSelected={selected.includes(region)}
            onClick={() => toggle(region)}
          >
            {region}
          </RegionChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="w-full text-sm-medium text-gray-400">textOnly</span>
        {regions.slice(0, 3).map((region) => (
          <RegionChip key={region} variant="textOnly">
            {region}
          </RegionChip>
        ))}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

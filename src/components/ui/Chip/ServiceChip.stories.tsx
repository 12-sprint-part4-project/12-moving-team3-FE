import { useState } from 'react';
import { fn } from 'storybook/test';

import { ServiceChip } from './ServiceChip';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ServiceChip> = {
  title: 'UI/Chip/ServiceChip',
  component: ServiceChip,
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
    children: '소형이사',
    variant: 'button',
    isSelected: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['button', 'textOnly'],
      description:
        'button: 선택 가능한 버튼 / textOnly: 표시 전용 (Service는 항상 파란)',
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
      description: '서비스 라벨',
    },
  },
};
export default meta;

type Story = StoryObj<typeof ServiceChip>;

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
  const services = ['소형이사', '가정이사', '사무실이사'] as const;
  const [selected, setSelected] = useState<string[]>(['소형이사']);

  const toggle = (service: string) => {
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
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
        {services.map((service) => (
          <ServiceChip
            key={service}
            variant="button"
            isSelected={selected.includes(service)}
            onClick={() => toggle(service)}
          >
            {service}
          </ServiceChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="w-full text-sm-medium text-gray-400">textOnly</span>
        {services.map((service) => (
          <ServiceChip key={service} variant="textOnly">
            {service}
          </ServiceChip>
        ))}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

import { useState, type ComponentProps } from 'react';
import { fn } from 'storybook/test';

import { FilterCheckBox } from './FilterCheckBox';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof FilterCheckBox> = {
  title: 'UI/FilterCheckBox',
  component: FilterCheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[20.5rem]">
        <Story />
      </div>
    ),
  ],
  args: {
    label: '소형이사',
    checked: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof FilterCheckBox>;

const InteractiveFilterCheckBox = (
  args: ComponentProps<typeof FilterCheckBox>
) => {
  const [checked, setChecked] = useState(args.checked);

  return (
    <FilterCheckBox
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        args.onCheckedChange(nextChecked);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveFilterCheckBox {...args} />,
};

export const Checked: Story = {
  args: {
    label: '가정이사',
    checked: true,
  },
  render: (args) => <InteractiveFilterCheckBox {...args} />,
};

export const Disabled: Story = {
  args: {
    label: '사무실이사',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: '사무실이사',
    checked: true,
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[20.5rem] flex-col overflow-hidden rounded-lg border border-line-100">
      <FilterCheckBox label="소형이사" checked={false} onCheckedChange={fn()} />
      <FilterCheckBox label="가정이사" checked={true} onCheckedChange={fn()} />
      <FilterCheckBox
        label="사무실이사"
        checked={false}
        disabled
        onCheckedChange={fn()}
      />
      <FilterCheckBox
        label="비활성 선택"
        checked={true}
        disabled
        onCheckedChange={fn()}
      />
    </div>
  ),
};

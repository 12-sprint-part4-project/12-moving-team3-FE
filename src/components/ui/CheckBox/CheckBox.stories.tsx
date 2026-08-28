import { useState, type ComponentProps } from 'react';
import { fn } from 'storybook/test';

import { CheckBox } from './CheckBox';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof CheckBox> = {
  title: 'UI/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    checked: false,
    onCheckedChange: fn(),
    size: 'sm',
    shape: 'round',
    'aria-label': '선택',
  },
  argTypes: {
    checked: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    shape: {
      control: 'select',
      options: ['round', 'square'],
    },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof CheckBox>;

const InteractiveCheckBox = (args: ComponentProps<typeof CheckBox>) => {
  const [checked, setChecked] = useState(args.checked);

  return (
    <CheckBox
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
  render: (args) => <InteractiveCheckBox {...args} />,
};

export const Active: Story = {
  args: {
    checked: true,
  },
  render: (args) => <InteractiveCheckBox {...args} />,
};

export const Square: Story = {
  args: {
    shape: 'square',
    checked: true,
  },
  render: (args) => <InteractiveCheckBox {...args} />,
};

export const Medium: Story = {
  args: {
    size: 'md',
    checked: true,
  },
  render: (args) => <InteractiveCheckBox {...args} />,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

/** Figma check-box Frame의 8가지 변형 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <CheckBox
          checked
          size="sm"
          shape="round"
          aria-label="sm round active"
          onCheckedChange={fn()}
        />
        <CheckBox
          checked={false}
          size="sm"
          shape="round"
          aria-label="sm round default"
          onCheckedChange={fn()}
        />
        <CheckBox
          checked
          size="sm"
          shape="square"
          aria-label="sm square active"
          onCheckedChange={fn()}
        />
        <CheckBox
          checked={false}
          size="sm"
          shape="square"
          aria-label="sm square default"
          onCheckedChange={fn()}
        />
      </div>
      <div className="flex items-center gap-5">
        <CheckBox
          checked
          size="md"
          shape="round"
          aria-label="md round active"
          onCheckedChange={fn()}
        />
        <CheckBox
          checked={false}
          size="md"
          shape="round"
          aria-label="md round default"
          onCheckedChange={fn()}
        />
        <CheckBox
          checked
          size="md"
          shape="square"
          aria-label="md square active"
          onCheckedChange={fn()}
        />
        <CheckBox
          checked={false}
          size="md"
          shape="square"
          aria-label="md square default"
          onCheckedChange={fn()}
        />
      </div>
    </div>
  ),
};

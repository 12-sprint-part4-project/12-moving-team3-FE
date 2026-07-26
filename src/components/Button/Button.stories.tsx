import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    showIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Primary CTA 버튼',
    size: 'sm',
    showIcon: false,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const SmDefault: Story = {
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Property 2=hover, Property 3=sm — blue-200 고정 표시용 */
export const SmHover: Story = {
  args: { className: '!bg-blue-200' },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const SmDisabled: Story = {
  args: { disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const SmWithIcon: Story = {
  args: { showIcon: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const SmWithIconDisabled: Story = {
  args: { showIcon: true, disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdDefault: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Property 2=hover, Property 3=md — blue-200 고정 표시용 */
export const MdHover: Story = {
  args: { size: 'md', className: '!bg-blue-200' },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdDisabled: Story = {
  args: { size: 'md', disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdWithIcon: Story = {
  args: { size: 'md', showIcon: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdWithIconDisabled: Story = {
  args: { size: 'md', showIcon: true, disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

import { fn } from 'storybook/test';

import { TabButton } from './TabButton';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof TabButton> = {
  title: 'UI/TabButton',
  component: TabButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    size: 'sm',
    defaultValue: 'pending',
    onValueChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof TabButton>;

/** Figma Tab-button — Property 1=Tab-button, Property 2=sm */
export const Sm: Story = {
  args: { size: 'sm' },
};

/** Figma Tab-button — Property 1=Tab, Property 2=md */
export const Md: Story = {
  args: { size: 'md' },
};

/** sm / md 나란히 비교 */
export const Comparison: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <TabButton size="sm" defaultValue="pending" onValueChange={fn()} />
      <TabButton size="md" defaultValue="pending" onValueChange={fn()} />
    </div>
  ),
};

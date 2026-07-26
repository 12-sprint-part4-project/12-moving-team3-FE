import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    href: { control: 'text' },
  },
  args: {
    size: 'sm',
    href: '/',
  },
};
export default meta;

type Story = StoryObj<typeof Logo>;

/** Figma logo-text sm (88×34) */
export const Sm: Story = {};

/** Figma logo-text md (116×44) */
export const Md: Story = {
  args: { size: 'md' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Logo size="sm" />
      <Logo size="md" />
    </div>
  ),
};

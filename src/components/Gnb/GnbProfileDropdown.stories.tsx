import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GnbProfileDropdown } from './GnbProfileDropdown';

const meta: Meta<typeof GnbProfileDropdown> = {
  title: 'UI/GnbProfileDropdown',
  component: GnbProfileDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#525252' }],
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    userName: '김가나',
    nameSuffix: '고객님',
    onLogout: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof GnbProfileDropdown>;

export const Small: Story = {
  args: { size: 'sm' },
};

export const Medium: Story = {
  args: { size: 'md' },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex items-start gap-8">
      <GnbProfileDropdown {...args} size="sm" />
      <GnbProfileDropdown {...args} size="md" />
    </div>
  ),
};

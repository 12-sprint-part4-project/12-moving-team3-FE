import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GnbNotificationDropdown } from './GnbNotificationDropdown';
import {
  NOTIFICATION_FIXTURES,
  NOTIFICATION_LIST_FIXTURE,
} from './notificationFixtures';

const meta: Meta<typeof GnbNotificationDropdown> = {
  title: 'UI/GnbNotificationDropdown',
  component: GnbNotificationDropdown,
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
    items: NOTIFICATION_LIST_FIXTURE,
    onClose: fn(),
    onItemClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof GnbNotificationDropdown>;

export const ListMedium: Story = {
  args: { size: 'md', items: NOTIFICATION_LIST_FIXTURE },
};

export const ListSmall: Story = {
  args: { size: 'sm', items: NOTIFICATION_LIST_FIXTURE },
};

export const Empty: Story = {
  args: { size: 'md', items: [] },
};

export const Loading: Story = {
  args: { size: 'md', items: [], isLoading: true },
};

export const AllTypes: Story = {
  args: { size: 'md', items: NOTIFICATION_FIXTURES },
};

export const SizeComparison: Story = {
  render: (args) => (
    <div className="flex items-start gap-8">
      <GnbNotificationDropdown {...args} size="sm" />
      <GnbNotificationDropdown {...args} size="md" />
    </div>
  ),
  args: {
    items: NOTIFICATION_LIST_FIXTURE,
  },
};

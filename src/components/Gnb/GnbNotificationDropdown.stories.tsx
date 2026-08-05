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
  args: {
    items: NOTIFICATION_LIST_FIXTURE,
    onClose: fn(),
    onItemClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof GnbNotificationDropdown>;

export const List: Story = {
  args: { items: NOTIFICATION_LIST_FIXTURE },
};

export const Empty: Story = {
  args: { items: [] },
};

export const Loading: Story = {
  args: { items: [], isLoading: true },
};

export const AllTypes: Story = {
  args: { items: NOTIFICATION_FIXTURES },
};

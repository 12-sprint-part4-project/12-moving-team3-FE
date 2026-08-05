import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GnbNotificationItem } from './GnbNotificationItem';
import { NOTIFICATION_FIXTURES } from './notificationFixtures';

const offerItem = NOTIFICATION_FIXTURES.find(
  (item) => item.type === 'NEW_QUOTE_OFFER_ARRIVED'
)!;
const confirmedItem = NOTIFICATION_FIXTURES.find(
  (item) => item.type === 'QUOTE_CONFIRMED'
)!;
const reminderItem = NOTIFICATION_FIXTURES.find(
  (item) => item.type === 'CUSTOMER_MOVE_DAY_REMINDER'
)!;

const meta: Meta<typeof GnbNotificationItem> = {
  title: 'UI/GnbNotificationItem',
  component: GnbNotificationItem,
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
    item: offerItem,
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem] overflow-hidden rounded-2xl bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GnbNotificationItem>;

export const Medium: Story = {
  args: { size: 'md', item: offerItem },
};

export const Small: Story = {
  args: { size: 'sm', item: offerItem },
  decorators: [
    (Story) => (
      <div className="w-[17.25rem] overflow-hidden rounded-2xl bg-white">
        <Story />
      </div>
    ),
  ],
};

/** 강조 규칙 샘플 — 견적 / 확정 / 이사 예정일 */
export const HighlightVariants: Story = {
  render: () => (
    <div className="flex w-[20.4375rem] flex-col overflow-hidden rounded-2xl bg-white">
      <GnbNotificationItem item={offerItem} size="md" onClick={fn()} />
      <GnbNotificationItem item={confirmedItem} size="md" onClick={fn()} />
      <GnbNotificationItem item={reminderItem} size="md" onClick={fn()} />
    </div>
  ),
  decorators: [],
};

/** 12종 타입 전체 */
export const AllTypes: Story = {
  render: () => (
    <div className="flex max-h-[40rem] w-[20.4375rem] flex-col overflow-y-auto rounded-2xl bg-white">
      {NOTIFICATION_FIXTURES.map((item) => (
        <GnbNotificationItem
          key={item.id}
          item={item}
          size="md"
          onClick={fn()}
        />
      ))}
    </div>
  ),
  decorators: [],
};

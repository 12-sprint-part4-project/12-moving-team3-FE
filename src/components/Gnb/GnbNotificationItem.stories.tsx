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
  args: {
    item: offerItem,
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[19.5rem] overflow-hidden rounded-2xl bg-white md:w-[22.5rem]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GnbNotificationItem>;

export const Default: Story = {};

/** 강조 규칙 샘플 — 견적 / 확정 / 이사 예정일 (미읽음) */
export const HighlightVariants: Story = {
  render: () => (
    <div className="flex w-[19.5rem] flex-col overflow-hidden rounded-2xl bg-white md:w-[22.5rem]">
      <GnbNotificationItem item={offerItem} onClick={fn()} />
      <GnbNotificationItem item={confirmedItem} onClick={fn()} />
      <GnbNotificationItem item={reminderItem} onClick={fn()} />
    </div>
  ),
  decorators: [],
};

/** 미읽음(파란 강조) vs 읽음(gray-300 plain) */
export const ReadVsUnread: Story = {
  render: () => (
    <div className="flex w-[19.5rem] flex-col overflow-hidden rounded-2xl bg-white md:w-[22.5rem]">
      <GnbNotificationItem
        item={{ ...offerItem, isRead: false }}
        onClick={fn()}
      />
      <GnbNotificationItem
        item={{ ...offerItem, id: offerItem.id + 100, isRead: true }}
        onClick={fn()}
      />
    </div>
  ),
  decorators: [],
};

/** 12종 타입 전체 */
export const AllTypes: Story = {
  render: () => (
    <div className="flex max-h-[40rem] w-[19.5rem] flex-col overflow-y-auto rounded-2xl bg-white md:w-[22.5rem]">
      {NOTIFICATION_FIXTURES.map((item) => (
        <GnbNotificationItem key={item.id} item={item} onClick={fn()} />
      ))}
    </div>
  ),
  decorators: [],
};

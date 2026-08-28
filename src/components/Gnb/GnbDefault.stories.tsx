import { fn } from 'storybook/test';

import { withQueryClient } from '@/storybook/withQueryClient';

import { GnbDefault } from './GnbDefault';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof GnbDefault> = {
  title: 'UI/GnbDefault',
  component: GnbDefault,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withQueryClient],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    sort: {
      control: 'select',
      options: ['gnb', 'tab', 'component'],
    },
    menu: {
      control: 'select',
      options: ['iconProfile', 'twoMenu', 'threeMenu'],
    },
  },
  args: {
    size: 'sm',
    sort: 'gnb',
    menu: 'iconProfile',
    userName: '김가나',
    activeTabId: 'pending',
    notificationRole: 'customer',
    onTabChange: fn(),
    onAlarmClick: fn(),
    onProfileClick: fn(),
    onMenuClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof GnbDefault>;

/** Figma gnb/default — sort=gnb, size=sm */
export const GnbSm: Story = {
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=gnb, size=md */
export const GnbMd: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[46.5rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=tab, size=sm */
export const TabSm: Story = {
  args: { sort: 'tab', size: 'sm' },
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=tab, size=md */
export const TabMd: Story = {
  args: { sort: 'tab', size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[46.5rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=component, size=sm */
export const ComponentSm: Story = {
  args: { sort: 'component', size: 'sm' },
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=component, size=md */
export const ComponentMd: Story = {
  args: { sort: 'component', size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[46.5rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=gnb, sort-2=2-menu, size=lg */
export const GnbLgTwoMenu: Story = {
  args: { size: 'lg', menu: 'twoMenu' },
  decorators: [
    (Story) => (
      <div className="w-[120rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/default — sort=gnb, sort-2=3-menu, size=lg */
export const GnbLgThreeMenu: Story = {
  args: { size: 'lg', menu: 'threeMenu' },
  decorators: [
    (Story) => (
      <div className="w-[120rem]">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background-200 p-6">
      <div className="w-[23.4375rem]">
        <p className="mb-2 text-md-medium text-black-400">gnb / sm</p>
        <GnbDefault size="sm" sort="gnb" />
      </div>
      <div className="w-[46.5rem]">
        <p className="mb-2 text-md-medium text-black-400">gnb / md</p>
        <GnbDefault size="md" sort="gnb" />
      </div>
      <div className="w-[23.4375rem]">
        <p className="mb-2 text-md-medium text-black-400">component / sm</p>
        <GnbDefault size="sm" sort="component" />
      </div>
      <div className="w-[46.5rem]">
        <p className="mb-2 text-md-medium text-black-400">component / md</p>
        <GnbDefault size="md" sort="component" />
      </div>
      <div className="w-full min-w-[75rem]">
        <p className="mb-2 text-md-medium text-black-400">gnb / lg / 2-menu</p>
        <GnbDefault size="lg" menu="twoMenu" notificationRole="mover" />
      </div>
      <div className="w-full min-w-[75rem]">
        <p className="mb-2 text-md-medium text-black-400">gnb / lg / 3-menu</p>
        <GnbDefault size="lg" menu="threeMenu" notificationRole="customer" />
      </div>
    </div>
  ),
};

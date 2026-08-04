import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { withQueryClient } from '@/storybook/withQueryClient';
import { Gnb2Depth } from './Gnb2Depth';

const meta: Meta<typeof Gnb2Depth> = {
  title: 'UI/Gnb2Depth',
  component: Gnb2Depth,
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
    activeTab: {
      control: 'select',
      options: ['tab-1', 'tab-2'],
    },
  },
  args: {
    size: 'sm',
    activeTab: 'tab-2',
    onTabChange: fn(),
    onAlarmClick: fn(),
    onProfileClick: fn(),
    onMenuClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof Gnb2Depth>;

/** Figma gnb/2-depth — size=sm */
export const Sm: Story = {
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/2-depth — size=md */
export const Md: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[46.5rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/2-depth — size=lg, Property 2=tab-1 */
export const LgTab1: Story = {
  args: { size: 'lg', activeTab: 'tab-1' },
  decorators: [
    (Story) => (
      <div className="w-[120rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/2-depth — size=lg, Property 2=tab-2 */
export const LgTab2: Story = {
  args: { size: 'lg', activeTab: 'tab-2' },
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
        <p className="mb-2 text-md-medium text-black-400">size=sm</p>
        <Gnb2Depth
          size="sm"
          activeTab="tab-2"
          onAlarmClick={fn()}
          onProfileClick={fn()}
          onMenuClick={fn()}
        />
      </div>
      <div className="w-[46.5rem]">
        <p className="mb-2 text-md-medium text-black-400">size=md</p>
        <Gnb2Depth
          size="md"
          activeTab="tab-2"
          onAlarmClick={fn()}
          onProfileClick={fn()}
          onMenuClick={fn()}
        />
      </div>
      <div className="w-full min-w-[75rem]">
        <p className="mb-2 text-md-medium text-black-400">
          size=lg / Property 2=tab-1
        </p>
        <Gnb2Depth size="lg" activeTab="tab-1" onTabChange={fn()} />
      </div>
      <div className="w-full min-w-[75rem]">
        <p className="mb-2 text-md-medium text-black-400">
          size=lg / Property 2=tab-2
        </p>
        <Gnb2Depth size="lg" activeTab="tab-2" onTabChange={fn()} />
      </div>
    </div>
  ),
};

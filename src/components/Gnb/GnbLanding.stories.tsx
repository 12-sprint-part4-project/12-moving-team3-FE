import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GnbLanding } from './GnbLanding';

const meta: Meta<typeof GnbLanding> = {
  title: 'UI/GnbLanding',
  component: GnbLanding,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'sm',
    onMenuClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof GnbLanding>;

/** Figma gnb/landing size=sm (375) */
export const Sm: Story = {
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma gnb/landing size=md (744) */
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

/** Figma gnb/landing size=lg (1920) */
export const Lg: Story = {
  args: { size: 'lg' },
  decorators: [
    (Story) => (
      <div className="w-[120rem]">
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-background-200 p-6">
      <div className="w-[23.4375rem]">
        <GnbLanding size="sm" onMenuClick={fn()} />
      </div>
      <div className="w-[46.5rem]">
        <GnbLanding size="md" onMenuClick={fn()} />
      </div>
      <div className="w-full min-w-[75rem]">
        <GnbLanding size="lg" />
      </div>
    </div>
  ),
};

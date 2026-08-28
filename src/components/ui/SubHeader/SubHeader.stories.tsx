import { SubHeader } from './SubHeader';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof SubHeader> = {
  title: 'UI/SubHeader',
  component: SubHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'responsive'],
    },
  },
  args: {
    size: 'responsive',
    moveType: '소형이사',
    requestedAt: '2024년 6월 24일',
    from: '서울시 중구',
    to: '경기도 수원시',
    moveDate: '2024년 07월 01일 (월)',
  },
};
export default meta;

type Story = StoryObj<typeof SubHeader>;

/** Figma Sub header/요청견적 — size=PC */
export const Pc: Story = {
  args: { size: 'lg' },
  decorators: [
    (Story) => (
      <div className="w-[120rem] bg-background-200">
        <Story />
      </div>
    ),
  ],
};

/** Figma Sub header/요청견적 — size=Tablet */
export const Tablet: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[46.5rem] bg-background-200">
        <Story />
      </div>
    ),
  ],
};

/** Figma Sub header/요청견적 — size=Mobile */
export const Mobile: Story = {
  args: { size: 'sm' },
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem] bg-background-200">
        <Story />
      </div>
    ),
  ],
};

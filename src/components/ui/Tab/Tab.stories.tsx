import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Tab } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'UI/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    active: {
      control: 'boolean',
    },
    variant: {
      control: 'select',
      options: ['default', 'depth'],
    },
  },
  args: {
    active: true,
    variant: 'default',
    children: '견적요청',
    onClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof Tab>;

/** Figma tap — Property 1=active */
export const Active: Story = {
  args: {
    active: true,
    children: '견적요청',
  },
};

/** Figma tap — Property 1=default */
export const Default: Story = {
  args: {
    active: false,
    children: '기사님 찾기',
  },
};

/** active / default 나란히 비교 */
export const Comparison: Story = {
  render: () => (
    <div className="flex items-center gap-6" role="tablist">
      <Tab active onClick={fn()}>
        견적요청
      </Tab>
      <Tab onClick={fn()}>기사님 찾기</Tab>
    </div>
  ),
};

/** Figma gnb/2-depth 탭 */
export const Depth: Story = {
  render: () => (
    <div
      className="flex h-20 items-start gap-8 border-b border-line-100 bg-white px-8 pt-4"
      role="tablist"
    >
      <Tab variant="depth" active onClick={fn()}>
        대기 중인 견적
      </Tab>
      <Tab variant="depth" onClick={fn()}>
        받았던 견적
      </Tab>
    </div>
  ),
};

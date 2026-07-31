import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[22.5rem] rounded-2xl bg-background-200">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    message: {
      control: 'text',
      description: '스피너 하단 안내 문구. 없으면 스피너만 표시',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

/** 스피너만 표시 */
export const Default: Story = {
  args: {},
};

/** 안내 문구와 함께 표시 */
export const WithMessage: Story = {
  args: {
    message: '받은 요청을 불러오는 중...',
  },
};

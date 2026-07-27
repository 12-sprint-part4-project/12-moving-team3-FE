import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextFieldChat } from './TextFieldChat';

const meta: Meta<typeof TextFieldChat> = {
  title: 'UI/Input/TextFieldChat',
  component: TextFieldChat,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-background-200 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    children: '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['incoming', 'mePrimary', 'meSecondary'],
      description:
        '말풍선 색상. incoming(수신/흰), mePrimary(파란), meSecondary(연파란)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '말풍선 크기 (sm | md)',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextFieldChat>;

export const IncomingSm: Story = {
  args: {
    color: 'incoming',
    size: 'sm',
  },
};

export const IncomingMd: Story = {
  args: {
    color: 'incoming',
    size: 'md',
  },
};

export const MePrimarySm: Story = {
  args: {
    color: 'mePrimary',
    size: 'sm',
  },
};

export const MePrimaryMd: Story = {
  args: {
    color: 'mePrimary',
    size: 'md',
    children: '소형이사 (원룸, 투룸, 20평대 미만)',
  },
};

export const MeSecondarySm: Story = {
  args: {
    color: 'meSecondary',
    size: 'sm',
  },
};

export const MeSecondaryMd: Story = {
  args: {
    color: 'meSecondary',
    size: 'md',
    children: '소형이사 (원룸, 투룸, 20평대 미만)',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-lg-medium text-black-400">sm</p>
        <TextFieldChat color="incoming" size="sm">
          몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
        </TextFieldChat>
        <TextFieldChat color="mePrimary" size="sm">
          몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
        </TextFieldChat>
        <TextFieldChat color="meSecondary" size="sm">
          몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
        </TextFieldChat>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-lg-medium text-black-400">md</p>
        <TextFieldChat color="incoming" size="md">
          몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
        </TextFieldChat>
        <TextFieldChat color="mePrimary" size="md">
          소형이사 (원룸, 투룸, 20평대 미만)
        </TextFieldChat>
        <TextFieldChat color="meSecondary" size="md">
          소형이사 (원룸, 투룸, 20평대 미만)
        </TextFieldChat>
      </div>
    </div>
  ),
};

import { TextFieldChat } from './TextFieldChat';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
      options: [
        'incoming',
        'mePrimary',
        'meSecondary',
        'filteredIncoming',
        'filteredMine',
      ],
      description:
        '말풍선 색상. incoming(수신/흰), mePrimary(파란), meSecondary(연파란), filteredIncoming/filteredMine(필터 안내)',
    },
    desktopChildren: {
      control: 'text',
      description: '데스크톱에서만 다른 문구가 필요할 때',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextFieldChat>;

export const Incoming: Story = {
  args: {
    color: 'incoming',
  },
};

export const MePrimary: Story = {
  args: {
    color: 'mePrimary',
  },
};

export const MeSecondary: Story = {
  args: {
    color: 'meSecondary',
  },
};

export const FilteredIncoming: Story = {
  args: {
    color: 'filteredIncoming',
    children:
      '민감한 개인정보가 감지되었습니다. 개인정보 보호를 위해 해당 내용이 가려집니다.',
  },
};

export const FilteredMine: Story = {
  args: {
    color: 'filteredMine',
    children:
      '민감한 개인정보가 감지되었습니다. 개인정보 보호를 위해 해당 내용이 가려집니다.',
  },
};

/** 모바일/데스크톱 문구가 다른 경우 */
export const WithDesktopChildren: Story = {
  args: {
    color: 'incoming',
    children: '이사 종류를 알려주세요.',
    desktopChildren: '이사 종류를 선택해 주세요.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <TextFieldChat color="incoming">
        몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
      </TextFieldChat>
      <TextFieldChat color="mePrimary">
        몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
      </TextFieldChat>
      <TextFieldChat color="meSecondary">
        몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
      </TextFieldChat>
      <TextFieldChat color="filteredIncoming">
        민감한 개인정보가 감지되었습니다. 개인정보 보호를 위해 해당 내용이
        가려집니다.
      </TextFieldChat>
      <TextFieldChat color="filteredMine">
        부적절한 언어 사용이 감지되었습니다. 반복될 경우 제재가 진행됩니다.
      </TextFieldChat>
      <TextFieldChat
        color="incoming"
        desktopChildren="이사 종류를 선택해 주세요."
      >
        이사 종류를 알려주세요.
      </TextFieldChat>
    </div>
  ),
};

import { useState } from 'react';
import { fn } from 'storybook/test';

import { TextArea } from './TextArea';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof TextArea> = {
  title: 'UI/Input/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem] rounded-2xl bg-background-300 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    placeholder: '최소 10자 이상 입력해주세요',
  },
  argTypes: {
    onChange: {
      description: '입력값 변경 시 호출되는 핸들러',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '텍스트 영역 크기 (sm | md)',
    },
    isError: {
      control: 'boolean',
      description: 'true면 빨간 보더의 에러 상태로 표시',
    },
    disabled: {
      control: 'boolean',
      description: 'true면 입력 비활성화',
    },
    errorMessage: {
      control: 'text',
      description: '필드 아래 에러 문구. 없으면 undefined',
    },
    placeholder: {
      control: 'text',
      description: '값이 비어 있을 때 보여줄 안내 문구',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const SizeSm: Story = {
  args: {
    size: 'sm',
  },
};

export const SizeMd: Story = {
  args: {
    size: 'md',
  },
};

export const Filled: Story = {
  args: {
    size: 'md',
    defaultValue:
      'text area는 최소 10자 이상 입력해야 버튼이 활성화됩니다. 또한 input 내용이 길어지면 내부 스크롤이 나타납니다.',
  },
};

export const Error: Story = {
  args: {
    size: 'md',
    defaultValue: '후기',
    isError: true,
    errorMessage: '10자 이상 입력해주세요.',
  },
};

export const Disabled: Story = {
  args: {
    size: 'md',
    defaultValue: '비활성화된 텍스트 영역입니다.',
    disabled: true,
  },
};

const InteractiveTextArea = ({ size }: { size: 'sm' | 'md' }) => {
  const [value, setValue] = useState('');
  return (
    <TextArea
      size={size}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="최소 10자 이상 입력해주세요"
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTextArea size="md" />,
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-[40rem] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">TextArea (sm)</p>
        <InteractiveTextArea size="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">TextArea (md)</p>
        <InteractiveTextArea size="md" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-background-300 p-8">
        <Story />
      </div>
    ),
  ],
};

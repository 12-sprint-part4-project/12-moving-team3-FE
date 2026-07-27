import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { TextFieldOutlined } from './TextFieldOutlined';

const meta: Meta<typeof TextFieldOutlined> = {
  title: 'UI/Input/TextFieldOutlined',
  component: TextFieldOutlined,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem] rounded-2xl bg-gradient-to-r from-background-200 to-white p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    placeholder: 'codeit@email.com',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '입력 필드 크기 (sm | md)',
    },
    onChange: {
      description: '입력값 변경 시 호출되는 핸들러',
    },
    isError: {
      control: 'boolean',
      description: 'true면 빨간 보더의 에러 상태로 표시',
    },
    showVisibilityToggle: {
      control: 'boolean',
      description: '비밀번호 보기/숨기기 아이콘 표시 여부',
    },
    disabled: {
      control: 'boolean',
      description: 'true면 입력 비활성화',
    },
    errorMessage: {
      control: 'text',
      description:
        '필드 아래 에러 문구. 에러가 없으면 undefined로 둘 것. isError=false이고 값이 비어 있으면 필수 입력 피드백으로 표시',
    },
    placeholder: {
      control: 'text',
      description: '값이 비어 있을 때 보여줄 안내 문구',
    },
    type: {
      control: 'select',
      options: ['text', 'password'],
      description: 'input type. password일 때 showVisibilityToggle과 함께 사용',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextFieldOutlined>;

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
    size: 'sm',
    defaultValue: 'codeit@email.com',
  },
};

/** 값이 있는 상태에서 형식 오류 */
export const ErrorWithValue: Story = {
  args: {
    size: 'sm',
    defaultValue: 'codeit@email.com',
    isError: true,
    errorMessage: '이메일 형식이 아닙니다.',
  },
};

/** 필수값 미입력 피드백 (회색 보더 + 에러 메시지) */
export const RequiredFeedback: Story = {
  args: {
    size: 'sm',
    placeholder: '가게 이름(상호명)을 입력해주세요.',
    errorMessage: '가게 이름(상호명)을 필수로 입력해주세요.',
    isError: false,
  },
};

export const Password: Story = {
  args: {
    size: 'sm',
    type: 'password',
    showVisibilityToggle: true,
    placeholder: '비밀번호를 입력해주세요.',
  },
};

export const Disabled: Story = {
  args: {
    size: 'sm',
    defaultValue: 'codeit@email.com',
    disabled: true,
  },
};

const InteractiveOutlined = ({ size }: { size: 'sm' | 'md' }) => {
  const [value, setValue] = useState('');
  return (
    <TextFieldOutlined
      size={size}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="codeit@email.com"
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveOutlined size="sm" />,
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-[40rem] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Outlined (sm)</p>
        <InteractiveOutlined size="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Outlined (md)</p>
        <InteractiveOutlined size="md" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-r from-background-200 to-white p-8">
        <Story />
      </div>
    ),
  ],
};

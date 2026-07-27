import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { TextFieldSearch } from './TextFieldSearch';

const meta: Meta<typeof TextFieldSearch> = {
  title: 'UI/Input/TextFieldSearch',
  component: TextFieldSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[50rem] rounded-2xl bg-background-200 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    onClear: fn(),
    onSearch: fn(),
    placeholder: '텍스트를 입력해 주세요.',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '검색 입력 필드 크기 (sm | md)',
    },
    onChange: {
      description: '입력값 변경 시 호출되는 핸들러',
    },
    onClear: {
      description: 'X(클리어) 버튼 클릭 시 추가 호출. 값 비우기와 별도',
    },
    onSearch: {
      description: '검색 아이콘 클릭 또는 Enter 입력 시 호출',
    },
    disabled: {
      control: 'boolean',
      description: 'true면 입력·클리어·검색 비활성화',
    },
    placeholder: {
      control: 'text',
      description: '값이 비어 있을 때 보여줄 안내 문구',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextFieldSearch>;

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
    defaultValue: '텍스트를 입력해 주세요.',
  },
};

export const Disabled: Story = {
  args: {
    size: 'sm',
    defaultValue: '검색어',
    disabled: true,
  },
};

const InteractiveSearch = ({ size }: { size: 'sm' | 'md' }) => {
  const [value, setValue] = useState('');
  return (
    <TextFieldSearch
      size={size}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue('')}
      onSearch={() => undefined}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSearch size="sm" />,
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-[40rem] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Search (sm)</p>
        <InteractiveSearch size="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Search (md)</p>
        <InteractiveSearch size="md" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-background-200 p-8">
        <Story />
      </div>
    ),
  ],
};

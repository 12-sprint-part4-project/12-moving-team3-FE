import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
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
    onPageChange: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
      description: 'Pagination 컴포넌트 사이즈 : sm, lg',
    },
    page: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '총 페이지 수',
    },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

/** sm 사이즈 */
export const SizeSm: Story = {
  args: {
    size: 'sm',
    page: 1,
    totalPages: 9,
  },
};

/** lg 사이즈 */
export const SizeLg: Story = {
  args: {
    size: 'lg',
    page: 1,
    totalPages: 9,
  },
};

/** 첫 페이지 — 이전 버튼 비활성 */
export const FirstPage: Story = {
  args: {
    size: 'sm',
    page: 1,
    totalPages: 9,
  },
};

/** 중간 페이지 — ellipsis 포함 */
export const MiddlePage: Story = {
  args: {
    size: 'sm',
    page: 5,
    totalPages: 9,
  },
};

/** 마지막 페이지 — 다음 버튼 비활성 */
export const LastPage: Story = {
  args: {
    size: 'sm',
    page: 9,
    totalPages: 9,
  },
};

/** 페이지 수가 적어 ellipsis 없이 전체 표시 */
export const FewPages: Story = {
  args: {
    size: 'sm',
    page: 2,
    totalPages: 4,
  },
};

/** render 안 컴포넌트 선언 시 remount로 상태가 초기화되므로 모듈 스코프로 분리 */
const InteractivePagination = ({
  size,
  totalPages,
}: {
  size: 'sm' | 'lg';
  totalPages: number;
}) => {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      size={size}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
};

/** 클릭으로 페이지 전환되는 인터랙티브 예시 */
export const Interactive: Story = {
  render: () => <InteractivePagination size="sm" totalPages={9} />,
};

/** sm / lg 비교 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Pagination (sm)</p>
        <InteractivePagination size="sm" totalPages={9} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Pagination (lg)</p>
        <InteractivePagination size="lg" totalPages={9} />
      </div>
    </div>
  ),
};

import { useState } from 'react';
import { fn } from 'storybook/test';

import { Calendar } from './Calendar';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[20.5rem] md:max-w-[40rem]">
        <Story />
      </div>
    ),
  ],
  args: {
    onValueChange: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelectedDate: Story = {
  args: {
    defaultValue: new Date(2024, 6, 12),
  },
};

/** 오늘부터 30일 뒤까지만 선택 가능 — 과거일 비활성 확인용 */
export const WithDateRange: Story = {
  args: {
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
};

/** render 안 컴포넌트 선언은 remount를 유발하므로 모듈 스코프로 분리 */
const InteractiveCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [confirmedDate, setConfirmedDate] = useState<Date | undefined>();

  return (
    <div className="flex flex-col gap-3">
      <Calendar
        value={selectedDate}
        onValueChange={setSelectedDate}
        onConfirm={setConfirmedDate}
        minDate={new Date()}
      />
      <p className="text-md-regular text-black-400">
        확정된 날짜:{' '}
        {confirmedDate ? confirmedDate.toLocaleDateString('ko-KR') : '없음'}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveCalendar />,
};

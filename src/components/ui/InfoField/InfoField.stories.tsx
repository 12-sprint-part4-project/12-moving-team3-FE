import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InfoField } from './InfoField';

const meta: Meta<typeof InfoField> = {
  title: 'Common/UI/InfoField',
  component: InfoField,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'radio', options: ['blue', 'red', 'neutral'] },
  },
};
export default meta;

type Story = StoryObj<typeof InfoField>;

/** 기본 형태 (예: 이사일/출발처럼 라벨 pill + 값 텍스트 크기가 동일한 경우) */
export const Default: Story = {
  args: {
    label: '이사일',
    value: '2024. 07. 01(월)',
    labelClassName: 'px-1.5 py-1 text-2lg-regular',
    valueClassName: 'text-2lg-medium text-black-300',
  },
};

/** labelClassName/valueClassName으로 값 스타일만 덮어써 강조하는 변형 (예: 견적가) */
export const EstimatedPrice: Story = {
  args: {
    label: '견적가',
    value: '210,000원',
    labelClassName: 'px-1.5 py-1 text-2lg-regular',
    valueClassName: 'text-xl-medium text-black-400',
  },
};

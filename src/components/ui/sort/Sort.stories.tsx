import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Sort, type SortOption } from './Sort';

const SORT_OPTIONS: SortOption[] = [
  { label: '리뷰 많은순', value: 'mostReviews' },
  { label: '평점 높은순', value: 'highestRating' },
  { label: '경력 높은순', value: 'mostExperience' },
  { label: '확정 많은순', value: 'mostConfirmed' },
];

const meta: Meta<typeof Sort> = {
  title: 'UI/Sort',
  component: Sort,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[16rem] w-[12rem]">
        <Story />
      </div>
    ),
  ],
  args: {
    options: SORT_OPTIONS,
    onValueChange: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Sort>;

export const Medium: Story = {
  args: {
    size: 'md',
    defaultValue: 'mostReviews',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    defaultValue: 'mostReviews',
  },
};

export const WithSelectedValue: Story = {
  args: {
    size: 'md',
    defaultValue: 'highestRating',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Sort (md)</p>
        <Sort options={SORT_OPTIONS} size="md" defaultValue="mostReviews" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Sort (sm)</p>
        <Sort options={SORT_OPTIONS} size="sm" defaultValue="mostReviews" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Selected</p>
        <Sort options={SORT_OPTIONS} size="md" defaultValue="highestRating" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-[24rem] w-[12rem]">
        <Story />
      </div>
    ),
  ],
};

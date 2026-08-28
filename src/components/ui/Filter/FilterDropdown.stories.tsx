import { fn } from 'storybook/test';

import { FilterDropdown } from './FilterDropdown';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof FilterDropdown> = {
  title: 'UI/FilterDropdown',
  component: FilterDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[16rem] w-[20.5rem]">
        <Story />
      </div>
    ),
  ],
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['region', 'service'],
    },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof FilterDropdown>;

export const Region: Story = {
  args: {
    type: 'region',
    defaultValue: 'ALL',
  },
};

export const Service: Story = {
  args: {
    type: 'service',
    defaultValue: 'ALL',
  },
};

export const WithSelectedValue: Story = {
  args: {
    type: 'region',
    defaultValue: 'SEOUL',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Region</p>
        <FilterDropdown type="region" defaultValue="ALL" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Service</p>
        <FilterDropdown type="service" defaultValue="ALL" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Selected Region</p>
        <FilterDropdown type="region" defaultValue="SEOUL" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-[32rem] w-[20.5rem]">
        <Story />
      </div>
    ),
  ],
};

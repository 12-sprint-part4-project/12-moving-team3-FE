import { fn } from 'storybook/test';

import { Dropdown } from './Dropdown';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[24rem] w-[20.5rem]">
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
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Region: Story = {
  args: {
    type: 'region',
    size: 'md',
    defaultValue: 'ALL',
  },
};

export const Service: Story = {
  args: {
    type: 'service',
    size: 'md',
    defaultValue: 'ALL',
  },
};

export const RegionSmall: Story = {
  args: {
    type: 'region',
    size: 'sm',
    defaultValue: 'ALL',
  },
};

export const ServiceSmall: Story = {
  args: {
    type: 'service',
    size: 'sm',
    defaultValue: 'ALL',
  },
};

export const WithSelectedValue: Story = {
  args: {
    type: 'region',
    size: 'md',
    defaultValue: 'SEOUL',
  },
};

export const Disabled: Story = {
  args: {
    type: 'service',
    size: 'md',
    defaultValue: 'ALL',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Region (md)</p>
        <Dropdown type="region" size="md" defaultValue="ALL" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Service (md)</p>
        <Dropdown type="service" size="md" defaultValue="ALL" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Region (sm)</p>
        <Dropdown type="region" size="sm" defaultValue="ALL" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg-medium text-black-400">Service (sm)</p>
        <Dropdown type="service" size="sm" defaultValue="ALL" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-[40rem] w-[20.5rem]">
        <Story />
      </div>
    ),
  ],
};

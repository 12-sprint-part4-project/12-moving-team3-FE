import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { FilterButton } from './FilterButton';

const meta: Meta<typeof FilterButton> = {
  title: 'UI/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    active: false,
    disabled: false,
    'aria-label': '필터',
    onClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof FilterButton>;

/** Figma Button filter/sm — Property 3=default */
export const Default: Story = {};

/** Figma Button filter/sm — Property 3=active */
export const Active: Story = {
  args: { active: true },
};

/** default / active 나란히 비교 */
export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FilterButton aria-label="필터" />
      <FilterButton active aria-label="필터" />
    </div>
  ),
};

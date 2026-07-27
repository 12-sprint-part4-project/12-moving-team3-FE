import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outlined'],
    },
    showIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Primary CTA 버튼',
    size: 'sm',
    variant: 'solid',
    showIcon: false,
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const SmDefault: Story = {
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Solid CTA Property 2=hover, Property 3=sm */
export const SmHover: Story = {
  args: { className: '!bg-blue-200' },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const SmDisabled: Story = {
  args: { disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const SmWithIcon: Story = {
  args: { showIcon: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const SmWithIconDisabled: Story = {
  args: { showIcon: true, disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdDefault: Story = {
  args: { size: 'md' },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Solid CTA Property 2=hover, Property 3=md */
export const MdHover: Story = {
  args: { size: 'md', className: '!bg-blue-200' },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdDisabled: Story = {
  args: { size: 'md', disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdWithIcon: Story = {
  args: { size: 'md', showIcon: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

export const MdWithIconDisabled: Story = {
  args: { size: 'md', showIcon: true, disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Button/outlined/CTA — sm default */
export const SmOutlinedDefault: Story = {
  args: { variant: 'outlined' },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Button/outlined/CTA — sm hover (blue-50 고정 표시용) */
export const SmOutlinedHover: Story = {
  args: { variant: 'outlined', className: '!bg-blue-50 !shadow-cta-hover' },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Button/outlined/CTA — sm disabled */
export const SmOutlinedDisabled: Story = {
  args: { variant: 'outlined', disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[20.4375rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Button/outlined/CTA — md default */
export const MdOutlinedDefault: Story = {
  args: { size: 'md', variant: 'outlined' },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Button/outlined/CTA — md hover (blue-50 고정 표시용) */
export const MdOutlinedHover: Story = {
  args: {
    size: 'md',
    variant: 'outlined',
    className: '!bg-blue-50 !shadow-cta-hover',
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

/** Figma Button/outlined/CTA — md disabled */
export const MdOutlinedDisabled: Story = {
  args: { size: 'md', variant: 'outlined', disabled: true },
  decorators: [
    (Story) => (
      <div className="w-[40rem]">
        <Story />
      </div>
    ),
  ],
};

'use client';

import { ReportButton } from '@/components/reports/ReportButton';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReportButton> = {
  title: 'Reports/ReportButton',
  component: ReportButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ReportButton>;

export const Default: Story = {
  args: {
    onClick: () => {},
  },
};

export const Disabled: Story = {
  args: {
    onClick: () => {},
    disabled: true,
  },
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
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
      options: ['iconText', 'icon'],
    },
    href: { control: 'text' },
  },
  args: {
    size: 'sm',
    variant: 'iconText',
    href: '/',
  },
};
export default meta;

type Story = StoryObj<typeof Logo>;

/** Figma logo-text sm (88×34) */
export const Sm: Story = {};

/** Figma logo-text md (116×44) */
export const Md: Story = {
  args: { size: 'md' },
};

/** Figma logo-icon sm — gnb/default sm용 */
export const IconSm: Story = {
  args: { variant: 'icon', size: 'sm' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Logo size="sm" variant="icon" />
      <Logo size="sm" />
      <Logo size="md" />
    </div>
  ),
};

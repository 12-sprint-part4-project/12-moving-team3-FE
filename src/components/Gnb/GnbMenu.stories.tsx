import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { GnbMenu } from './GnbMenu';

const meta: Meta<typeof GnbMenu> = {
  title: 'UI/GnbMenu',
  component: GnbMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['customer', 'mover'],
    },
  },
  args: {
    type: 'customer',
    onClose: fn(),
  },
  decorators: [
    (Story) => (
      <div className="h-[51.1875rem] border border-line-100">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GnbMenu>;

/** Figma gnb_menu — type=일반 유저 */
export const Customer: Story = {
  args: { type: 'customer' },
};

/** Figma gnb_menu — type=기사님 */
export const Mover: Story = {
  args: { type: 'mover' },
};

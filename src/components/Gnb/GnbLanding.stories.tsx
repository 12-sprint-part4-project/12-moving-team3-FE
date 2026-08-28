import MenuIcon from '@/assets/icons/menu.svg';

import { GnbLanding } from './GnbLanding';
import { GnbLandingLoginButton } from './GnbLandingLoginButton';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof GnbLanding> = {
  title: 'UI/GnbLanding',
  component: GnbLanding,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'sm',
  },
};
export default meta;

type Story = StoryObj<typeof GnbLanding>;

const MenuPlaceholder = () => (
  <button
    type="button"
    aria-label="메뉴 열기"
    className="inline-flex size-6 shrink-0 items-center justify-center [&_path]:stroke-gray-300"
  >
    <MenuIcon className="size-6" aria-hidden />
  </button>
);

export const Sm: Story = {
  args: { menuSlot: <MenuPlaceholder /> },
  decorators: [
    (Story) => (
      <div className="w-[23.4375rem]">
        <Story />
      </div>
    ),
  ],
};

export const Md: Story = {
  args: { size: 'md', menuSlot: <MenuPlaceholder /> },
  decorators: [
    (Story) => (
      <div className="w-[46.5rem]">
        <Story />
      </div>
    ),
  ],
};

export const Lg: Story = {
  args: { size: 'lg', loginButton: <GnbLandingLoginButton /> },
  decorators: [
    (Story) => (
      <div className="w-[120rem]">
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-background-200 p-6">
      <div className="w-[23.4375rem]">
        <GnbLanding size="sm" menuSlot={<MenuPlaceholder />} />
      </div>
      <div className="w-[46.5rem]">
        <GnbLanding size="md" menuSlot={<MenuPlaceholder />} />
      </div>
      <div className="w-full min-w-[75rem]">
        <GnbLanding size="lg" loginButton={<GnbLandingLoginButton />} />
      </div>
    </div>
  ),
};

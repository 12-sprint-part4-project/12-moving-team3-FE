import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: '견적 요청하기',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    children: '취소',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: '찜하기',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    disabled: true,
    children: '이사일 이후 견적 요청 불가',
  },
};

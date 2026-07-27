/**
 * ⚠️ TEMPORARY EXAMPLE STORY
 *
 * Storybook + Chromatic 세팅 검증 및 Button.tsx의 cva(class-variance-authority)
 * 사용 예시를 확인하기 위한 임시 스토리입니다.
 * Figma 디자인 기준의 실제 공통 Button 컴포넌트가 만들어지면 이 파일과
 * Button.tsx는 삭제해도 됩니다.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
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

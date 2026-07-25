import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlarmIcon from '@/assets/icons/alarm.svg';
import { Toast } from './Toast';
import { ToastProvider } from '@/providers/ToastProvider';
import { useToast } from '@/hooks/useToast';

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    content: '확정하지 않은 견적이에요!',
  },
};

export const WithIcon: Story = {
  args: {
    content: '확정하지 않은 견적이에요!',
    icon: <AlarmIcon />,
  },
};

export const LongContent: Story = {
  args: {
    content:
      '내용이 길어지는 경우에도 토스트 한 줄 안에서 자연스럽게 줄바꿈되는지 확인하기 위한 긴 문구입니다.',
  },
};

/** ToastProvider + useToast 훅으로 실제 전역 토스트가 트리거되는 흐름을 보여준다. */
const ToastTriggerDemo = () => {
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        showToast({ content: '링크가 복사되었어요', icon: <AlarmIcon /> })
      }
      className="rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
    >
      토스트 띄우기
    </button>
  );
};

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <ToastTriggerDemo />
    </ToastProvider>
  ),
};

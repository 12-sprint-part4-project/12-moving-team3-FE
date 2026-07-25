import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlarmIcon from '@/assets/icons/alarm.svg';
import StarIcon from '@/assets/icons/star.svg';
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
    icon: AlarmIcon,
    iconClassName: 'size-4 shrink-0 sm:size-6 text-blue-300 fill-current',
  },
};

/**
 * iconClassName으로 기본값(24x24 + currentColor)을 대체해 아이콘만 다르게 커스텀한 예시.
 * fill="currentColor"로 그려진 star.svg를 사용해 색 커스텀이 실제로 반영되는 것을 보여준다.
 */
export const CustomIcon: Story = {
  args: {
    content: '아이콘 크기와 색을 다르게 커스텀했어요',
    icon: StarIcon,
    iconClassName: 'size-8 shrink-0 text-yellow-100 fill-current',
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
  let toastNum = 1; // 토스트 번호 초기화

  return (
    <button
      type="button"
      onClick={() =>
        showToast({
          content: `Toast${toastNum++} 링크가 복사되었어요`, // 토스트가 여러개 띄워져도 순차적으로 번호가 증가하도록 처리, 사라지는건 띄워졌던 순서대로 사라짐
          icon: AlarmIcon,
        })
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

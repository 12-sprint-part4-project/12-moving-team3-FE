'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';

interface MoverDetailPendingStatusProps {
  variant: 'pending';
}

interface MoverDetailMessageStatusProps {
  variant: 'invalid' | 'notFound';
}

interface MoverDetailErrorStatusProps {
  variant: 'error';
  message: string;
  onRetry: () => void;
}

export type MoverDetailStatusProps =
  | MoverDetailPendingStatusProps
  | MoverDetailMessageStatusProps
  | MoverDetailErrorStatusProps;

const STATUS_MESSAGE: Record<'invalid' | 'notFound', string> = {
  invalid: '유효하지 않은 기사님입니다.',
  notFound: '기사님을 찾을 수 없어요.',
};

/** `/movers/[id]` 가드 UI. 잘못된 id·로딩·404·에러. */
export const MoverDetailStatus = (props: MoverDetailStatusProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  if (props.variant === 'pending') {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col py-24"
      >
        <Spinner message="기사님 정보를 불러오는 중..." />
      </motion.div>
    );
  }

  if (props.variant === 'error') {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col items-center gap-4 py-24"
      >
        <p className="text-lg-medium text-gray-400">{props.message}</p>
        <Button
          type="button"
          variant="solid"
          size="sm"
          onClick={props.onRetry}
          className="w-auto"
        >
          다시 시도
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className="flex w-full flex-col items-center justify-center py-24"
    >
      <p className="text-lg-medium text-gray-400">
        {STATUS_MESSAGE[props.variant]}
      </p>
    </motion.div>
  );
};

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { HTMLAttributes, ReactNode } from 'react';

interface EstimateRequestChatPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 흰 패널(카드)에만 적용할 className */
  panelClassName?: string;
}

/**
 * 견적요청 채팅형 인터랙션 패널.
 * 체크폼·캘린더·주소·CTA 등 입력을 담는 흰 바탕 + chat-panel shadow.
 * 우측 상단만 각진 말풍선 형태, md+ 우측 정렬.
 * 패널이 마운트될 때마다(스텝 전환·수정 모드 전환 포함) 입력·버튼 전체가 한 덩어리로 fadeInUp.
 */
export const EstimateRequestChatPanel = ({
  children,
  className,
  panelClassName,
  ...rest
}: EstimateRequestChatPanelProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn('flex w-full flex-col md:items-end', className)}
      {...rest}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={getMotionTransition(shouldReduceMotion)}
        className={cn(
          'flex w-full flex-col gap-4 bg-white p-4 shadow-chat-panel',
          // tl/bl/br 32px, tr 각짐 (발신 말풍선)
          'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
          'md:w-[39rem] md:gap-6 md:p-10',
          'md:rounded-tl-[2rem] md:rounded-br-[2rem] md:rounded-bl-[2rem]',
          panelClassName
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};

import { motion, useReducedMotion } from 'framer-motion';
import { Children } from 'react';


import { fadeUp, getListStagger, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

interface EstimateRequestChatBubbleGroupProps {
  children: ReactNode;
  /**
   * 말풍선 정렬.
   * - start: 시스템(수신) 연속 발화
   * - end: 유저(발신) 티키타카 한 턴
   */
  align?: 'start' | 'end';
  className?: string;
}

/**
 * 채팅 말풍선 턴 그룹 — ChatPanel 바깥 flex와 같은 역할.
 * 같은 화자가 연속으로 보낸 말풍선은 한 그룹, 티키타카는 턴마다 그룹.
 * items-start/end로 hug 폭을 유지해 flex stretch로 말풍선이 늘어나지 않게 한다.
 * 그룹이 마운트될 때마다(스텝 전환·수정 모드 전환 포함) 말풍선이 순차적으로 fadeInUp.
 */
export const EstimateRequestChatBubbleGroup = ({
  children,
  align = 'start',
  className,
}: EstimateRequestChatBubbleGroupProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={getListStagger(shouldReduceMotion)}
      initial="hidden"
      animate="show"
      className={cn(
        'flex w-full flex-col gap-2 md:gap-6',
        align === 'end' ? 'items-end' : 'items-start',
        className
      )}
    >
      {Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={fadeUp}
          transition={getMotionTransition(shouldReduceMotion)}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

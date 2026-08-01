import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface EstimateRequestChatBubbleGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * 말풍선 정렬.
   * - start: 시스템(수신) 연속 발화
   * - end: 유저(발신) 티키타카 한 턴
   */
  align?: 'start' | 'end';
}

/**
 * 채팅 말풍선 턴 그룹 — ChatPanel 바깥 flex와 같은 역할.
 * 같은 화자가 연속으로 보낸 말풍선은 한 그룹, 티키타카는 턴마다 그룹.
 * items-start/end로 hug 폭을 유지해 flex stretch로 말풍선이 늘어나지 않게 한다.
 */
export const EstimateRequestChatBubbleGroup = ({
  children,
  align = 'start',
  className,
  ...rest
}: EstimateRequestChatBubbleGroupProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 md:gap-6',
        align === 'end' ? 'items-end' : 'items-start',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

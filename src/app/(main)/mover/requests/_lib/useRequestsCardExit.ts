'use client';

import { useState } from 'react';

/**
 * 견적 보내기·반려 성공 후 목록에서 빠지는 카드 id.
 * exit 애니메이션이 끝나면 handleExitComplete로 제거한다.
 */
export const useRequestsCardExit = () => {
  const [exitingIds, setExitingIds] = useState<Set<number>>(() => new Set());

  const handleExitComplete = (id: number) => {
    setExitingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const markExiting = (id: number) => {
    setExitingIds((prev) => new Set(prev).add(id));
  };

  return {
    exitingIds,
    handleExitComplete,
    markExiting,
  };
};

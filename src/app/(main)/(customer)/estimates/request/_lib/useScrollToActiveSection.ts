'use client';

import { useEffect, useRef } from 'react';

/**
 * 현재 활성 섹션이 바뀔 때(스텝 진입, "수정하기" 토글 등) 화면 맨 아래로 스크롤.
 * 리턴한 ref를 각 스텝 최하단 sentinel에 붙인다 — 조건부로 감춰지는 섹션들 뒤에 항상
 * 마지막으로 렌더되므로, 그 시점에 실제로 보여야 할 활성 섹션 바로 다음에 위치한다.
 * activeKey가 바뀔 때만(마운트 포함) 스크롤한다.
 */
export const useScrollToActiveSection = (
  activeKey: string,
  shouldReduceMotion: boolean | null
) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [activeKey, shouldReduceMotion]);

  return bottomRef;
};

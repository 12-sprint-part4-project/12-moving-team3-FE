import { useEffect, type RefObject } from 'react';

const DEFAULT_SCROLLBAR_OFFSET = 6;

/**
 * 스크롤바 너비만큼 content 요소에 margin-right를 보정하는 Hook
 * region 2열 리스트처럼 스크롤바가 레이아웃을 밀어낼 때 사용
 */
export const useScrollbarGutterCompensation = (
  listRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  offset: number = DEFAULT_SCROLLBAR_OFFSET
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listElement = listRef.current;
    const contentElement = contentRef.current;
    if (!listElement || !contentElement) {
      return;
    }

    const updateScrollbarMargin = () => {
      const nextScrollbarWidth =
        listElement.offsetWidth - listElement.clientWidth;
      const adjustedMargin = Math.max(0, nextScrollbarWidth - offset);
      contentElement.style.marginRight = `${adjustedMargin}px`;
    };

    updateScrollbarMargin();
    const resizeObserver = new ResizeObserver(updateScrollbarMargin);
    resizeObserver.observe(listElement);

    return () => {
      resizeObserver.disconnect();
      contentElement.style.marginRight = '';
    };
  }, [listRef, contentRef, enabled, offset]);
};

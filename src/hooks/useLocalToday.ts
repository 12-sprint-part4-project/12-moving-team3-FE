'use client';

import { useSyncExternalStore } from 'react';

/** getSnapshot 참조 안정성 — 같은 로컬 일자면 동일 Date 인스턴스 유지 */
let clientToday: Date | undefined;

/** 로컬 자정 기준 "오늘" (시분초 0) */
const createLocalToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const isSameLocalDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * 캐시된 "오늘"을 반환. 날짜가 바뀌었으면(자정 경과) 갱신한다.
 */
const getClientToday = (): Date => {
  const today = createLocalToday();
  if (!clientToday || !isSameLocalDay(clientToday, today)) {
    clientToday = today;
  }
  return clientToday;
};

/**
 * 다음 자정·탭 복귀 시 구독자에게 알려 이미 열린 Calendar minDate도 갱신.
 */
const subscribe = (onStoreChange: () => void): (() => void) => {
  let timeoutId = 0;

  const scheduleMidnightRefresh = () => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const delayMs = Math.max(nextMidnight.getTime() - now.getTime(), 0);

    timeoutId = window.setTimeout(() => {
      clientToday = createLocalToday();
      onStoreChange();
      scheduleMidnightRefresh();
    }, delayMs);
  };

  scheduleMidnightRefresh();

  // 노트북 슬립 등으로 타이머가 밀린 뒤 탭을 다시 볼 때 일자 재확인
  const handleVisibilityChange = () => {
    if (document.visibilityState !== 'visible') {
      return;
    }
    const prev = clientToday;
    const next = getClientToday();
    if (!prev || prev.getTime() !== next.getTime()) {
      onStoreChange();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.clearTimeout(timeoutId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

const getClientSnapshot = (): Date | undefined => getClientToday();
const getServerSnapshot = (): Date | undefined => undefined;

/**
 * SSR에서는 undefined, 하이드레이션 후 로컬 "오늘".
 * effect 안 setState 없이 서버/클라 시각·시간대 불일치를 피한다.
 */
export const useLocalToday = (): Date | undefined =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

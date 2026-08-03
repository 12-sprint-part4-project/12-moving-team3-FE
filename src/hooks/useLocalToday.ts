'use client';

import { useSyncExternalStore } from 'react';

/** 외부 스토어 구독 없음 — 마운트 시점의 로컬 "오늘"만 읽음 */
const subscribe = () => () => {};

/** getSnapshot 참조 안정성 — 같은 세션에서 동일 Date 인스턴스 유지 */
let clientToday: Date | undefined;

const getClientToday = (): Date => {
  if (!clientToday) {
    const now = new Date();
    // 시분초 제거 — Calendar minDate 일자 비교용
    clientToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  return clientToday;
};

const getClientSnapshot = (): Date | undefined => getClientToday();
const getServerSnapshot = (): Date | undefined => undefined;

/**
 * SSR에서는 undefined, 하이드레이션 후 로컬 "오늘".
 * effect 안 setState 없이 서버/클라 시각·시간대 불일치를 피한다.
 */
export const useLocalToday = (): Date | undefined =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toast, type ToastIconComponent } from '@/components/ui/Toast/Toast';

/** 토스트가 화면에 머무는 기본 시간(ms). 별도 duration을 넘기지 않으면 이 값이 사용된다. */
const DEFAULT_DURATION = 3000;

/** 동시에 화면에 보여줄 토스트 최대 개수. 초과 시 가장 오래된 것부터 제거한다. */
const MAX_VISIBLE_TOASTS = 3;

/** exit 페이드 시간과 맞춤. oldest가 사라진 뒤에 밀림·등장을 이어가기 위한 기준. */
const EXIT_DURATION_MS = 150;

/** exit 직후 자리 밀림이 눈에 들어온 다음 새 토스트를 붙이기까지의 간격. */
const SHIFT_DURATION_MS = 120;

/**
 * 이 간격보다 짧게 연속 호출되면 "연타"로 보고 순차 연출 대신 즉시 FIFO로 교체한다.
 * 클릭 속도와 토스트 교체 속도가 어긋나지 않게 하기 위함.
 */
const RAPID_INTERVAL_MS = 300;

export interface ShowToastOptions {
  /** 토스트에 표시할 내용 (필수) */
  content: ReactNode;
  /** 토스트 앞에 보여줄 아이콘 컴포넌트 (선택). `import Icon from '@/assets/icons/xxx.svg'`로 가져온 svg 컴포넌트를 그대로 전달한다. */
  icon?: ToastIconComponent;
  /** 아이콘에 적용할 className (선택). 넘기지 않으면 `Toast`의 기본값(24x24 + currentColor)을 사용한다. */
  iconClassName?: string;
  /** 화면에 노출되는 시간(ms). 기본값 3000ms */
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => void;
}

interface ToastItem extends ShowToastOptions {
  id: number;
  duration: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * 앱 전역에서 `useToast()`로 토스트를 띄울 수 있게 해주는 Provider.
 * - 동시에 최대 `MAX_VISIBLE_TOASTS`개. 초과 시 FIFO.
 * - 호출 간격이 `RAPID_INTERVAL_MS` 이상이면 순차 연출(① 퇴장 → ② 밀림 → ③ 등장).
 * - 그보다 짧은 연타면 즉시 FIFO로 맞춰 클릭 속도와 교체 속도를 맞춘다.
 * - 각 토스트는 duration 만료·닫기 버튼으로 제거된다.
 * - UI는 `document.body` Portal로 상단 고정 노출한다.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  /** 포탈은 클라이언트 마운트 이후에만 렌더해 SSR HTML과 첫 클라이언트 HTML을 맞춘다. */
  const [isMounted, setIsMounted] = useState(false);
  const idRef = useRef(0);
  const timeoutsRef = useRef<Map<number, number>>(new Map());
  /** setState 비동기 때문에 최신 스택 길이를 동기적으로 볼 때 사용한다. */
  const toastsRef = useRef<ToastItem[]>([]);
  /** 순차 교체 대기열. 연타(즉시 FIFO) 시에는 비우고 한 번에 합친다. */
  const pendingRef = useRef<ToastItem[]>([]);
  /** oldest 퇴장→밀림 후 새 토스트를 붙이는 타이머. 중복 사이클 방지용. */
  const replaceTimerRef = useRef<number | undefined>(undefined);
  /** 직전 showToast 시각(ms). 연타 여부 판별에 사용. */
  const lastShownAtRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.clear();
      if (replaceTimerRef.current !== undefined) {
        window.clearTimeout(replaceTimerRef.current);
        replaceTimerRef.current = undefined;
      }
      pendingRef.current = [];
    };
  }, []);

  const clearToastTimeout = useCallback((id: number) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: number) => {
      clearToastTimeout(id);
      setToasts((prev) => {
        const next = prev.filter((toast) => toast.id !== id);
        toastsRef.current = next;
        return next;
      });
    },
    [clearToastTimeout]
  );

  const scheduleDismiss = useCallback(
    (item: ToastItem) => {
      // 이미 타이머가 있으면 덮어쓰지 않는다 (재호출 방지).
      if (timeoutsRef.current.has(item.id)) return;
      const timeoutId = window.setTimeout(
        () => removeToast(item.id),
        item.duration
      );
      timeoutsRef.current.set(item.id, timeoutId);
    },
    [removeToast]
  );

  const cancelReplaceTimer = useCallback(() => {
    if (replaceTimerRef.current !== undefined) {
      window.clearTimeout(replaceTimerRef.current);
      replaceTimerRef.current = undefined;
    }
  }, []);

  /**
   * 연타용 즉시 FIFO.
   * 진행 중이던 순차 교체를 취소하고, 대기열+신규를 한꺼번에 붙인 뒤 최근 3개만 남긴다.
   */
  const pushInstantFifo = useCallback(
    (item: ToastItem) => {
      cancelReplaceTimer();
      const burst = [...pendingRef.current, item];
      pendingRef.current = [];

      const prev = toastsRef.current;
      const next = [...prev, ...burst].slice(-MAX_VISIBLE_TOASTS);
      const nextIds = new Set(next.map((toast) => toast.id));

      prev.forEach((toast) => {
        if (!nextIds.has(toast.id)) clearToastTimeout(toast.id);
      });

      toastsRef.current = next;
      setToasts(next);

      // 화면에 남은 burst 항목만 dismiss 타이머를 건다.
      burst.forEach((burstItem) => {
        if (nextIds.has(burstItem.id)) scheduleDismiss(burstItem);
      });
    },
    [cancelReplaceTimer, clearToastTimeout, scheduleDismiss]
  );

  /**
   * 여유 있을 때(느린 호출) 대기열을 소비한다.
   * - 빈자리면 바로 붙이고
   * - 가득 찼으면 oldest만 먼저 뺀 뒤, exit+밀림 후에 새 토스트를 붙인다.
   */
  const processPending = useCallback(() => {
    if (replaceTimerRef.current !== undefined) return;
    if (pendingRef.current.length === 0) return;

    const current = toastsRef.current;

    if (current.length < MAX_VISIBLE_TOASTS) {
      const nextItem = pendingRef.current.shift();
      if (!nextItem) return;
      setToasts((prev) => {
        const next = [...prev, nextItem];
        toastsRef.current = next;
        return next;
      });
      scheduleDismiss(nextItem);
      processPending();
      return;
    }

    // ① oldest 퇴장 (새 토스트는 아직 안 붙임)
    const oldest = current[0];
    clearToastTimeout(oldest.id);
    setToasts((prev) => {
      const next = prev.slice(1);
      toastsRef.current = next;
      return next;
    });

    // ② exit → ③ 밀림 후 대기열 맨 앞을 하단에 붙인다.
    replaceTimerRef.current = window.setTimeout(() => {
      replaceTimerRef.current = undefined;
      const nextItem = pendingRef.current.shift();
      if (nextItem) {
        setToasts((prev) => {
          const next = [...prev, nextItem].slice(-MAX_VISIBLE_TOASTS);
          toastsRef.current = next;
          return next;
        });
        scheduleDismiss(nextItem);
      }
      processPending();
    }, EXIT_DURATION_MS + SHIFT_DURATION_MS);
  }, [clearToastTimeout, scheduleDismiss]);

  const showToast = useCallback(
    ({
      content,
      icon,
      iconClassName,
      duration = DEFAULT_DURATION,
    }: ShowToastOptions) => {
      const item: ToastItem = {
        id: (idRef.current += 1),
        content,
        icon,
        iconClassName,
        duration,
      };

      const now = Date.now();
      const isRapid =
        lastShownAtRef.current > 0 &&
        now - lastShownAtRef.current < RAPID_INTERVAL_MS;
      lastShownAtRef.current = now;

      // 연타: 순차 연출을 건너뛰고 클릭 속도에 맞게 즉시 교체한다.
      if (isRapid) {
        pushInstantFifo(item);
        return;
      }

      const canShowImmediately =
        toastsRef.current.length < MAX_VISIBLE_TOASTS &&
        pendingRef.current.length === 0 &&
        replaceTimerRef.current === undefined;

      if (canShowImmediately) {
        setToasts((prev) => {
          const next = [...prev, item];
          toastsRef.current = next;
          return next;
        });
        scheduleDismiss(item);
        return;
      }

      // 느린 호출 + 가득 참/교체 중 → 퇴장→밀림→등장 순차 경로
      pendingRef.current.push(item);
      processPending();
    },
    [processPending, pushInstantFifo, scheduleDismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isMounted
        ? createPortal(
            // Modal(z-50) 딤보다 위에 두어 모달+토스트 동시 노출 시 토스트가 가려지지 않게 한다
            <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:top-6">
              <AnimatePresence initial={false}>
                {toasts.map(({ id, content, icon, iconClassName }) => (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      layout: {
                        type: 'spring',
                        stiffness: 500,
                        damping: 40,
                        mass: 0.8,
                      },
                      opacity: { duration: EXIT_DURATION_MS / 1000 },
                      y: { duration: EXIT_DURATION_MS / 1000 },
                    }}
                    className="w-full max-w-[59.6875rem]"
                  >
                    <Toast
                      content={content}
                      icon={icon}
                      iconClassName={iconClassName}
                      onClose={() => removeToast(id)}
                      className="pointer-events-auto w-full"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
};

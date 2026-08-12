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
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * 앱 전역에서 `useToast()`로 토스트를 띄울 수 있게 해주는 Provider.
 * - 토스트를 배열(큐)로 쌓되 동시에 최대 `MAX_VISIBLE_TOASTS`개만 노출한다.
 *   초과 시 가장 오래된 토스트를 제거하고 새 토스트를 스택 하단에 붙인다(FIFO).
 * - 각 토스트는 자신의 duration이 지나면 개별 타이머로 자동 제거되며,
 *   닫기 버튼으로도 즉시 닫을 수 있다.
 * - `AnimatePresence` + `layout`으로 퇴장·위치 밀림을 부드럽게 처리한다.
 * - 실제 UI는 `document.body`에 Portal로 렌더링해 어떤 페이지의 레이아웃/overflow에도
 *   영향받지 않고 항상 최상단에 고정 노출되도록 한다.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  /** 포탈은 클라이언트 마운트 이후에만 렌더해 SSR HTML과 첫 클라이언트 HTML을 맞춘다. */
  const [isMounted, setIsMounted] = useState(false);
  const idRef = useRef(0);
  // 토스트가 여러 개 동시에 떠 있을 수 있어, id별 타이머를 Map으로 관리하고
  // Provider가 언마운트될 때 남아있는 타이머를 모두 정리한다.
  // window.setTimeout/clearTimeout은 브라우저 환경 기준으로 항상 number를 반환한다.
  const timeoutsRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      content,
      icon,
      iconClassName,
      duration = DEFAULT_DURATION,
    }: ShowToastOptions) => {
      const id = (idRef.current += 1);
      // 연속 showToast에도 최대 개수를 넘지 않도록 prev 기준으로 append 후 FIFO trim한다.
      setToasts((prev) => {
        const next = [...prev, { id, content, icon, iconClassName, duration }];
        if (next.length <= MAX_VISIBLE_TOASTS) return next;

        // 화면에서 빠지는 oldest의 자동닫기 타이머도 함께 정리한다.
        const removed = next.slice(0, next.length - MAX_VISIBLE_TOASTS);
        removed.forEach((toast) => {
          const timeoutId = timeoutsRef.current.get(toast.id);
          if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
            timeoutsRef.current.delete(toast.id);
          }
        });
        return next.slice(-MAX_VISIBLE_TOASTS);
      });
      const timeoutId = window.setTimeout(() => removeToast(id), duration);
      timeoutsRef.current.set(id, timeoutId);
    },
    [removeToast]
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
                    transition={{ duration: 0.2 }}
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

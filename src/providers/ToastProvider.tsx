'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Toast, type ToastIconComponent } from '@/components/ui/Toast/Toast';

/** 토스트가 화면에 머무는 기본 시간(ms). 별도 duration을 넘기지 않으면 이 값이 사용된다. */
const DEFAULT_DURATION = 3000;

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
 * - 토스트를 배열(큐)로 쌓아두어 여러 개가 동시에 호출되면 순서대로 스택되어 보인다.
 * - 각 토스트는 자신의 duration이 지나면 개별 타이머로 자동 제거된다(닫기 버튼 없음).
 * - 실제 UI는 `document.body`에 Portal로 렌더링해 어떤 페이지의 레이아웃/overflow에도
 *   영향받지 않고 항상 최상단에 고정 노출되도록 한다.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: number) => {
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
      setToasts((prev) => [
        ...prev,
        { id, content, icon, iconClassName, duration },
      ]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 서버(SSR)에는 document가 없으므로, 브라우저에서만 body에 포탈로 렌더링한다.
          토스트 알림 자체가 최초 렌더링에는 항상 비어 있어 하이드레이션 시점 차이로
          인한 화면 불일치가 생기지 않는다. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:top-6">
            {toasts.map(({ id, content, icon, iconClassName }) => (
              <Toast
                key={id}
                content={content}
                icon={icon}
                iconClassName={iconClassName}
                className="pointer-events-auto w-full max-w-[59.6875rem]"
              />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};

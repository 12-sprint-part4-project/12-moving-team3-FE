import { useContext } from 'react';
import { ToastContext } from '@/providers/ToastProvider';

/**
 * 전역 토스트를 띄우는 훅. `showToast({ content, icon?, duration? })` 형태로 호출한다.
 * `ToastProvider` 하위에서만 사용할 수 있으며, 그 밖에서 호출하면 즉시 에러를 던져
 * Provider 연결 누락을 개발 시점에 바로 알아챌 수 있게 한다.
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};

'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

export type ModalPlacement = 'center' | 'bottom';

export interface ModalProps {
  /** dimmed 배경·ESC 등으로 닫을 때 호출 */
  onClose: () => void;
  /** 중앙(또는 하단)에 배치할 모달 콘텐츠 (제목/버튼 등은 children이 직접 담당) */
  children: ReactNode;
  /**
   * 패널 배치.
   * - center: 모든 뷰포트에서 dimmer 안 중앙 (주소/지정견적 등)
   * - bottom: 모바일 하단 시트 → sm부터 중앙 (이사 유형 필터 등)
   * @default 'center'
   */
  placement?: ModalPlacement;
  /** dimmed 영역 클릭 시 닫기 여부. 기본값 true */
  closeOnDimmedClick?: boolean;
  className?: string;
}

/** 클라이언트 전용 구독 — SSR/CSR 스냅샷만 다르면 되어 빈 subscribe로 충분하다. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 공통 모달 셸.
 * dimmed 배경 + children 배치만 담당하며, 모달 내용(제목/폼/버튼)에 대한 지식은 없다.
 * createPortal로 body에 렌더링하고, 마운트 동안 body 스크롤을 잠근다.
 *
 * 사용 예:
 * ```tsx
 * {isOpen && (
 *   <Modal onClose={handleClose}>
 *     <SelectAddressModal onClose={handleClose} ... />
 *   </Modal>
 * )}
 * ```
 */
export const Modal = ({
  onClose,
  children,
  placement = 'center',
  closeOnDimmedClick = true,
  className = '',
}: ModalProps) => {
  // SSR에서는 false, 클라이언트 하이드레이션 후 true로 맞춰져 포탈이 한 번 더 렌더된다.
  // (`typeof document` 가드만 쓰면 서버 null이 클라이언트에 고정되어 모달이 안 뜨는 경우가 있다.)
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  // 모달이 열려 있는 동안 배경 페이지 스크롤을 막는다.
  useEffect(() => {
    if (!isClient) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isClient]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isClient) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, onClose]);

  if (!isClient) return null;

  const isBottomSheet = placement === 'bottom';

  return createPortal(
    <div
      role="presentation"
      className={cn(
        // Figma dimmer: #141414 @ 50% → bg-dimmer/50
        'fixed inset-0 z-50 flex justify-center bg-dimmer/50',
        // center: 모든 breakpoint에서 중앙. bottom: 모바일 하단 → sm부터 중앙
        isBottomSheet
          ? 'items-end sm:items-center sm:px-4'
          : 'items-center px-4',
        className
      )}
      onClick={() => {
        if (closeOnDimmedClick) onClose();
      }}
    >
      {/*
        너비는 이 래퍼에서 고정한다.
        sm:w-auto면 children 콘텐츠 Intrinsic 폭으로 줄어들어
        패널의 w-full max-w-*가 의도한 공통 폭을 못 맞춘다.
      */}
      <div
        className={cn(
          'max-h-[90vh] w-full overflow-hidden overflow-y-auto sm:max-w-[38rem]',
          isBottomSheet
            ? 'rounded-t-[2rem] sm:rounded-[2rem]'
            : 'rounded-[1.5rem] sm:rounded-[2rem]'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

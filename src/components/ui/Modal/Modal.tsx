'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import {
  bottomSheetPanelVariants,
  centerModalPanelVariants,
  dimmerVariants,
  getMotionTransition,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export type ModalPlacement = 'center' | 'bottom';

export interface ModalProps {
  /** 열림 상태. false면 exit 애니메이션 후 DOM에서 제거된다. @default true */
  isOpen?: boolean;
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
  /** dimmer(배경) 래퍼 className */
  className?: string;
  /** 패널(콘텐츠) 래퍼 className — 기본 sm:max-w-[38rem] 등을 덮어쓸 때 사용 */
  panelClassName?: string;
  /** 스크린 리더용 대화상자 이름 */
  ariaLabel?: string;
}

/** 클라이언트 전용 구독 — SSR/CSR 스냅샷만 다르면 되어 빈 subscribe로 충분하다. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Tab 순환 대상 — 비활성·숨김 필드는 제외한다. */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    if (element.closest('[aria-hidden="true"], [hidden]')) return false;
    return element.getClientRects().length > 0;
  });

/**
 * 공통 모달 셸.
 * dimmed 배경 + children 배치만 담당하며, 모달 내용(제목/폼/버튼)에 대한 지식은 없다.
 * createPortal로 body에 렌더링하고, 마운트 동안 body 스크롤을 잠근다.
 * 포커스 트랩·닫힌 뒤 트리거 복원으로 키보드 접근성을 보장한다.
 *
 * 사용 예:
 * ```tsx
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <SelectAddressModal onClose={handleClose} ... />
 * </Modal>
 * ```
 */
export const Modal = ({
  isOpen = true,
  onClose,
  children,
  placement = 'center',
  closeOnDimmedClick = true,
  className = '',
  panelClassName = '',
  ariaLabel,
}: ModalProps) => {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef<string | undefined>(undefined);

  const unlockBodyScroll = () => {
    if (previousOverflowRef.current === undefined) return;
    document.body.style.overflow = previousOverflowRef.current;
    previousOverflowRef.current = undefined;
  };

  useEffect(() => {
    if (!isClient || !isOpen) return;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }, [isClient, isOpen]);

  // 컴포넌트가 언마운트되는 경우에도 스크롤 락을 반드시 해제한다.
  useEffect(() => {
    return () => unlockBodyScroll();
  }, []);

  useEffect(() => {
    if (!isClient || !isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusables = getFocusableElements(panel);
    (focusables[0] ?? panel).focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = getFocusableElements(panel);
      if (elements.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;
      const focusOutside = !(active instanceof Node) || !panel.contains(active);

      if (event.shiftKey) {
        if (focusOutside || active === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }

      if (focusOutside || active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [isClient, isOpen, onClose]);

  if (!isClient) return null;

  const isBottomSheet = placement === 'bottom';
  const panelVariants = isBottomSheet
    ? bottomSheetPanelVariants
    : centerModalPanelVariants;
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return createPortal(
    <AnimatePresence onExitComplete={() => (!isOpen ? unlockBodyScroll() : undefined)}>
      {isOpen ? (
        <motion.div
          key="modal-dimmer"
          role="presentation"
          variants={dimmerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          transition={motionTransition}
          className={cn(
            'fixed inset-0 z-50 flex justify-center bg-dimmer/50',
            isBottomSheet
              ? 'items-end sm:items-center sm:px-4'
              : 'items-center px-4',
            className
          )}
          onClick={() => {
            if (closeOnDimmedClick) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={motionTransition}
            className={cn(
              'max-h-[90vh] w-full overflow-hidden overflow-y-auto outline-none sm:max-w-[38rem]',
              isBottomSheet
                ? 'rounded-t-[2rem] sm:rounded-[2rem]'
                : 'rounded-[1.5rem] sm:rounded-[2rem]',
              panelClassName
            )}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

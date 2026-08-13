import {
  useEffect,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
} from 'react';

const TRIGGER_OPEN_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Enter', ' ']);

const LIST_MOVE: Record<string, (active: number, last: number) => number> = {
  ArrowDown: (active) => active + 1,
  ArrowUp: (active) => active - 1,
  Home: () => 0,
  End: (_active, last) => last,
};

export interface UseListboxKeyboardParams {
  optionCount: number;
  selectedIndex: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLElement | null>;
  optionRefs: RefObject<Array<HTMLElement | null>>;
  onSelect: (index: number) => void;
}

/** listbox 열림·옵션 포커스·키보드 계약 */
export const useListboxKeyboard = ({
  optionCount,
  selectedIndex,
  isOpen,
  setIsOpen,
  triggerRef,
  optionRefs,
  onSelect,
}: UseListboxKeyboardParams) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = optionCount - 1;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      optionRefs.current[activeIndex]?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, activeIndex, optionRefs]);

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const openListbox = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const focusOption = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), lastIndex));
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    openListbox();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!TRIGGER_OPEN_KEYS.has(event.key)) {
      return;
    }
    event.preventDefault();
    openListbox();
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const nextIndex = LIST_MOVE[event.key]?.(activeIndex, lastIndex);
    if (nextIndex != null) {
      event.preventDefault();
      focusOption(nextIndex);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < optionCount) {
        onSelect(activeIndex);
        closeAndRestoreFocus();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndRestoreFocus();
      return;
    }

    if (event.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return {
    activeIndex,
    closeAndRestoreFocus,
    handleToggle,
    handleTriggerKeyDown,
    handleListKeyDown,
  };
};

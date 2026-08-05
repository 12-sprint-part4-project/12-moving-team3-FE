import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';

/**
 * 지정한 요소 바깥을 클릭하면 열림 상태를 닫는 Hook
 * isActive가 false이면 리스너를 등록하지 않음
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (ref.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [ref, isActive, setIsOpen]);
};

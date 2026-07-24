import { useState } from 'react';

/**
 * controlled(value) / uncontrolled(defaultValue) 선택 상태를 통합 관리
 */
export const useControllableValue = <T>(
  value: T | undefined,
  defaultValue: T,
  onValueChange?: (value: T) => void
) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const setValue = (nextValue: T) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return [selectedValue, setValue] as const;
};

'use client';

import { useEffect, useState } from 'react';

/**
 * value 변경을 delay(ms)만큼 디바운스한 값을 반환하는 훅
 */
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
};

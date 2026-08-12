'use client';

import { useEffect, useState } from 'react';

/**
 * value 변경을 delay(ms)만큼 디바운스한 값을 반환하는 훅
 */
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    //setTimeout: 지정한 시간(ms) 이후에 한 번 특정 함수를 실행하는 브라우저의 비동기 함수.
    //delay시간만큼 지난 후에, setDebouncedValue(value)를 실행시킨다.
    //timerId로 받는 이유는, 후에 정리를 시켜주기 위함이다.
    //setTimeout을 하면 타이머를 만들게 됨. 우리는 value가 바뀔 때마다 setDebouncedValue를 해주어야 하기에, 한번 만든 타이머는, 한 번 사용하고 없애야 한다.(그 타이머는 계속 같은 value만 들고 있을 테니까)
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      //타이머(timerId)를 정리해서 불필요한 setDebouncedValue 호출을 막기 위해 사용해요.
      //이로써 value나 delay가 바뀌면 이전 타이머를 취소하고, 최신 값만 반영됩니다.
      window.clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue; //최종 debouncedValue를 리턴해준다.
};

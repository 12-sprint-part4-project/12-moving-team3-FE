import { useState } from 'react';

/** 첫 로딩이 끝난 뒤에만 목록 entrance stagger */
export const useListEntranceStagger = (isPending: boolean) => {
  const [listAnim, setListAnim] = useState({
    stagger: false,
    sawLoading: false,
  });

  if (isPending && !listAnim.sawLoading) {
    setListAnim({ ...listAnim, sawLoading: true });
  } else if (!isPending && listAnim.sawLoading && !listAnim.stagger) {
    setListAnim({ sawLoading: false, stagger: true });
  }

  return listAnim.stagger;
};

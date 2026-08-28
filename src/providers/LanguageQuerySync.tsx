'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { i18n } from '@/i18n/i18n';

/** 언어 변경 시 서버에서 받은 표시 문자열(날짜·가격 등)을 다시 매핑한다. */
export const LanguageQuerySync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLanguageChanged = () => {
      void queryClient.invalidateQueries();
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [queryClient]);

  return null;
};

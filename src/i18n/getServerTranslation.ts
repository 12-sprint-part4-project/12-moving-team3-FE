import { cookies } from 'next/headers';
import { cache } from 'react';

import { LANGUAGE_STORAGE_KEY, resolveLanguage } from '@/i18n/config';
import { serverI18n } from '@/i18n/serverI18n';

/** 요청마다 쿠키에서 언어를 한 번만 읽는다. */
export const getRequestLanguage = cache(async () => {
  const cookieStore = await cookies();

  return resolveLanguage(cookieStore.get(LANGUAGE_STORAGE_KEY)?.value ?? null);
});

/** Server Component·generateMetadata에서 사용한다. 싱글톤 상태는 바꾸지 않는다. */
export const getServerTranslation = cache(async () => {
  const language = await getRequestLanguage();

  return {
    language,
    t: serverI18n.getFixedT(language),
  };
});

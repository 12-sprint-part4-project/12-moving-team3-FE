import { getServerTranslation } from '@/i18n/getServerTranslation';

import type { Metadata } from 'next';

/** 정적 페이지 title을 locale key 하나로 generateMetadata에 연결한다. */
export const createPageMetadata =
  (titleKey: string) => async (): Promise<Metadata> => {
    const { t } = await getServerTranslation();

    return { title: t(titleKey) };
  };

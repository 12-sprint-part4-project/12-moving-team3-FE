'use client';

import Link from 'next/link';

import { useTranslation } from '@/i18n/useTranslation';

/** `/chat/[roomId]` — 방 상세 로드 실패 */
export const ChatRoomErrorState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
      <p className="text-center text-lg-medium text-gray-300">
        {t('chat.roomError')}
      </p>
      <Link
        href="/chat"
        className="text-md-medium text-blue-300 underline-offset-2 hover:underline"
      >
        {t('chat.backToList')}
      </Link>
    </div>
  );
};

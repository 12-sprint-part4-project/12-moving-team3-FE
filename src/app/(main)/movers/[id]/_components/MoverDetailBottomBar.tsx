'use client';

import { cn } from '@/lib/utils';

import { MoverDetailCtaButtons } from './MoverDetailCtaButtons';
import type {
  MoverDetailChat,
  MoverDetailDesignated,
  MoverDetailFavorite,
} from '../_lib/moverDetailActions';

export interface MoverDetailBottomBarProps {
  favorite: MoverDetailFavorite;
  designated: MoverDetailDesignated;
  chat: MoverDetailChat;
  className?: string;
}

/** Tablet / Mobile 하단 sticky — 찜 아이콘 + 지정 견적 CTA */
export const MoverDetailBottomBar = ({
  favorite,
  designated,
  chat,
  className = '',
}: MoverDetailBottomBarProps) => {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] xl:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        <MoverDetailCtaButtons
          layout="bottomBar"
          favorite={favorite}
          designated={designated}
          chat={chat}
        />
      </div>
    </div>
  );
};

'use client';

import MenuIcon from '@/assets/icons/menu.svg';
import { useGuestHeaderMenu } from '@/components/layout/GuestHeaderMenuContext';

export const GnbLandingMenuButton = () => {
  const { openMenu } = useGuestHeaderMenu();

  return (
    <button
      type="button"
      aria-label="메뉴 열기"
      onClick={openMenu}
      className="inline-flex size-6 shrink-0 items-center justify-center [&_path]:stroke-gray-300"
    >
      <MenuIcon className="size-6" aria-hidden />
    </button>
  );
};

'use client';

import EditIcon from '@/assets/icons/edit.svg';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import {
  FLOATING_ACTION_BUTTON_SIZE_CLASS,
  FLOATING_ACTION_FIXED_CLASS,
  FLOATING_ACTION_INSET_X_CLASS,
  WRITE_FAB_BOTTOM_CLASS,
  WRITE_FAB_ICON_CLASS,
} from '@/constants/floatingActionLayout';
import type { CommunityTabId } from '@/constants/communityOptions';
import { useCommunityWriteAction } from '@/hooks/useCommunityWriteAction';
import { useFloatingActionScrollVisibility } from '@/hooks/useFloatingActionScrollVisibility';
import { cn } from '@/lib/utils';

type CommunityWriteButtonVariant = 'fab' | 'toolbar' | 'desktop';

interface CommunityWriteButtonProps {
  variant: CommunityWriteButtonVariant;
  activeTab?: CommunityTabId;
  className?: string;
}

interface CommunityWriteFabProps {
  onClick: () => void;
  className?: string;
}

/** Tablet·Desktop 스크롤 시에만 노출 — Mobile은 항상 표시 */
const CommunityWriteFab = ({
  onClick,
  className = '',
}: CommunityWriteFabProps) => {
  const visibilityClass = useFloatingActionScrollVisibility(true);

  return (
    <button
      type="button"
      aria-label="글쓰기"
      onClick={onClick}
      className={cn(
        FLOATING_ACTION_FIXED_CLASS,
        'bg-blue-300 hover:bg-blue-200',
        FLOATING_ACTION_BUTTON_SIZE_CLASS,
        FLOATING_ACTION_INSET_X_CLASS,
        WRITE_FAB_BOTTOM_CLASS,
        visibilityClass,
        className
      )}
    >
      <EditIcon
        className={cn(WRITE_FAB_ICON_CLASS, 'text-white')}
        aria-hidden
      />
    </button>
  );
};

/** 커뮤니티 글쓰기 — FAB / Tablet·Desktop 툴바·헤더 버튼 */
export const CommunityWriteButton = ({
  variant,
  activeTab = 'board',
  className = '',
}: CommunityWriteButtonProps) => {
  const { handleWriteClick, isLoginModalOpen, handleCloseLoginModal } =
    useCommunityWriteAction(activeTab);

  return (
    <>
      {variant === 'fab' ? (
        <CommunityWriteFab onClick={handleWriteClick} className={className} />
      ) : (
        <button
          type="button"
          onClick={handleWriteClick}
          className={cn(
            'hidden shrink-0 cursor-pointer items-center justify-center bg-blue-300 text-white transition-colors hover:bg-blue-200',
            variant === 'toolbar' &&
              'h-9 min-w-[6.875rem] rounded-lg px-4 text-sm-semibold min-[46.5rem]:inline-flex xl:hidden',
            variant === 'desktop' &&
              'h-[3.125rem] min-w-[11.25rem] rounded-lg px-4 text-xl-semibold xl:inline-flex',
            className
          )}
        >
          글쓰기
        </button>
      )}
      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </>
  );
};

'use client';

import EditIcon from '@/assets/icons/edit.svg';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import {
  FLOATING_ACTION_BUTTON_SIZE_CLASS,
  FLOATING_ACTION_FIXED_CLASS,
  FLOATING_ACTION_ICON_CLASS,
  FLOATING_ACTION_INSET_X_CLASS,
  WRITE_FAB_BOTTOM_CLASS,
} from '@/constants/floatingActionLayout';
import { COMMUNITY_FILTER_RESET_BUTTON_CLASS } from './CommunityFilterResetButton';
import { useCommunityWriteAction } from '@/hooks/useCommunityWriteAction';
import {
  type FloatingActionVisibility,
  useFloatingActionScrollVisibility,
} from '@/hooks/useFloatingActionScrollVisibility';
import { cn } from '@/lib/utils';

import type { CommunityTabId } from '@/constants/communityOptions';

type CommunityWriteButtonVariant = 'fab' | 'toolbar' | 'desktop' | 'tabbar';

interface CommunityWriteFabProps {
  onClick: () => void;
  visibility?: FloatingActionVisibility;
  bottomClass?: string;
}

/** 스크롤 전: Top 버튼 자리 / 스크롤 후: Top 버튼 위 */
const CommunityWriteFab = ({
  onClick,
  visibility = 'scroll',
  bottomClass = WRITE_FAB_BOTTOM_CLASS,
}: CommunityWriteFabProps) => {
  const visibilityClass = useFloatingActionScrollVisibility(visibility);

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
        bottomClass,
        visibilityClass
      )}
    >
      <EditIcon
        className={cn(FLOATING_ACTION_ICON_CLASS, 'text-white')}
        aria-hidden
      />
    </button>
  );
};

interface CommunityWriteButtonProps {
  variant: CommunityWriteButtonVariant;
  activeTab?: CommunityTabId;
  className?: string;
  visibility?: FloatingActionVisibility;
  bottomClass?: string;
}

/** 커뮤니티 글쓰기 — FAB / Tablet·Desktop 툴바·헤더 버튼 */
export const CommunityWriteButton = ({
  variant,
  activeTab = 'board',
  className = '',
  visibility,
  bottomClass,
}: CommunityWriteButtonProps) => {
  const {
    writeHref,
    handleWriteClick,
    isLoginModalOpen,
    handleCloseLoginModal,
  } = useCommunityWriteAction(activeTab);

  return (
    <>
      {variant === 'fab' ? (
        <CommunityWriteFab
          onClick={handleWriteClick}
          visibility={visibility}
          bottomClass={bottomClass}
        />
      ) : (
        <button
          type="button"
          aria-label={variant === 'toolbar' ? '글쓰기' : undefined}
          onClick={handleWriteClick}
          className={cn(
            'hidden shrink-0 cursor-pointer items-center justify-center transition-colors',
            variant !== 'toolbar' && 'bg-blue-300 text-white hover:bg-blue-200',
            variant === 'toolbar' &&
              cn(COMMUNITY_FILTER_RESET_BUTTON_CLASS, 'border-transparent bg-blue-300 text-white hover:bg-blue-200 hover:text-white min-[46.5rem]:inline-flex xl:hidden'),
            variant === 'desktop' &&
              'h-[3.125rem] min-w-[11.25rem] rounded-2xl px-4 text-xl-semibold xl:inline-flex',
            variant === 'tabbar' &&
              'h-11 w-full rounded-2xl px-5 text-lg-semibold inline-flex',
            className
          )}
        >
          {variant === 'toolbar' ? (
            <EditIcon className="size-6 text-white" aria-hidden />
          ) : (
            '글쓰기'
          )}
        </button>
      )}
      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        redirectTo={writeHref}
      />
    </>
  );
};

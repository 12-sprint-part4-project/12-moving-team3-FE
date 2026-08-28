'use client';

import ResetIcon from '@/assets/icons/reset.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

/** Mobile/Tablet filter/sm 트리거와 동일 높이 */
export const COMMUNITY_FILTER_RESET_BUTTON_CLASS =
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line-200 bg-white text-gray-400 transition-colors hover:text-gray-500';

interface CommunityFilterResetButtonProps {
  onClick: () => void;
  className?: string;
}

/** Mobile/Tablet 필터 초기화 아이콘 버튼 */
export const CommunityFilterResetButton = ({
  onClick,
  className = '',
}: CommunityFilterResetButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={t('community.resetFilterAria')}
      onClick={onClick}
      className={cn(COMMUNITY_FILTER_RESET_BUTTON_CLASS, className)}
    >
      <ResetIcon className="size-5 shrink-0" aria-hidden />
    </button>
  );
};

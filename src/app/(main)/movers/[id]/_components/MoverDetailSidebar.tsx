'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { FavoriteButton } from '@/components/Favorite';
import { MoverShareButtons } from '@/components/movers/MoverShareButtons';
import { fadeUp, getMotionTransition, tapScale } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { getDesignatedButtonLabel } from './getDesignatedButtonLabel';

export interface MoverDetailSidebarProps {
  name: string;
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  /** false면 지정 견적 안내·버튼 숨김 (기사 로그인 등) */
  showDesignatedCta?: boolean;
  onDesignatedQuoteClick: () => void;
  isDesignatedPending?: boolean;
  isAlreadyDesignated?: boolean;
  hasReceivedQuoteFromMover?: boolean;
  isQuoteStatusError?: boolean;
  isDesignatedStatusLoading?: boolean;
  /** 처리되지 않은 지정 견적 요청 에러 발생 시 비활성 */
  isDesignatedRequestFailed?: boolean;
  /** `/movers/[id]` 데스크톱: 지정 CTA 아래 `채팅하기` (지정 완료 후에만) */
  showChatCta?: boolean;
  onChatClick?: () => void;
  isChatPending?: boolean;
  description?: string | null;
  profileImageUrl?: string | null;
  className?: string;
}

/** Desktop 우측 — 지정 견적 CTA · 찜 · 공유 */
export const MoverDetailSidebar = ({
  name,
  isFavorited,
  onFavoriteClick,
  isFavoritePending = false,
  showDesignatedCta = true,
  onDesignatedQuoteClick,
  isDesignatedPending = false,
  isAlreadyDesignated = false,
  hasReceivedQuoteFromMover = false,
  isQuoteStatusError = false,
  isDesignatedStatusLoading = false,
  isDesignatedRequestFailed = false,
  showChatCta = false,
  onChatClick,
  isChatPending = false,
  description = null,
  profileImageUrl = null,
  className = '',
}: MoverDetailSidebarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const isHardDisabled =
    isDesignatedPending ||
    isAlreadyDesignated ||
    isDesignatedStatusLoading ||
    isDesignatedRequestFailed;
  const isSoftBlocked =
    (hasReceivedQuoteFromMover || isQuoteStatusError) && !isHardDisabled;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={motionTransition}
      className={cn(
        'flex w-full max-w-[22.125rem] shrink-0 flex-col gap-10',
        className
      )}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {showDesignatedCta ? (
          <p className="text-xl-semibold text-black-400">
            {name} 기사님에게 지정 견적을 요청해보세요!
          </p>
        ) : null}
        <motion.div
          className="w-full"
          {...(shouldReduceMotion ? {} : tapScale)}
        >
          <FavoriteButton
            variant="labeled"
            isFavorited={isFavorited}
            isPending={isFavoritePending}
            onClick={onFavoriteClick}
          />
        </motion.div>
        {showDesignatedCta ? (
          <motion.div
            className="w-full"
            {...(shouldReduceMotion ? {} : tapScale)}
          >
            <Button
              type="button"
              variant="solid"
              size="md"
              onClick={onDesignatedQuoteClick}
              disabled={isHardDisabled}
              aria-disabled={isHardDisabled || isSoftBlocked}
              aria-busy={isDesignatedPending || isDesignatedStatusLoading}
              className={cn(
                isSoftBlocked &&
                  'cursor-not-allowed bg-gray-100 hover:bg-gray-100'
              )}
            >
              {getDesignatedButtonLabel(
                isAlreadyDesignated,
                hasReceivedQuoteFromMover,
                isDesignatedPending,
                isDesignatedStatusLoading,
                isQuoteStatusError,
                isDesignatedRequestFailed
              )}
            </Button>
          </motion.div>
        ) : null}
        {showChatCta ? (
          <motion.div
            className="w-full"
            {...(shouldReduceMotion ? {} : tapScale)}
          >
            <Button
              type="button"
              variant="outlined"
              size="md"
              onClick={onChatClick}
              disabled={isChatPending}
              aria-busy={isChatPending}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isChatPending ? 'pending' : 'idle'}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={motionTransition}
                >
                  {isChatPending ? '연결 중...' : '채팅하기'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
        ) : null}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{
          ...motionTransition,
          delay: shouldReduceMotion ? 0 : 0.08,
        }}
        className="flex flex-col gap-[1.375rem] border-t border-line-100 pt-10"
      >
        <p className="text-xl-semibold text-black-400">
          나만 알기엔 아쉬운 기사님인가요?
        </p>
        <MoverShareButtons
          size="md"
          name={name}
          description={description}
          profileImageUrl={profileImageUrl}
        />
      </motion.div>
    </motion.aside>
  );
};

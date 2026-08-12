'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { FavoriteButton } from '@/components/Favorite';
import { fadeUp, getMotionTransition, tapScale } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { getDesignatedButtonLabel } from './getDesignatedButtonLabel';

export interface MoverDetailBottomBarProps {
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  /** false면 지정 견적 버튼 숨김 (기사 로그인 등) */
  showDesignatedCta?: boolean;
  onDesignatedQuoteClick: () => void;
  isDesignatedPending?: boolean;
  isAlreadyDesignated?: boolean;
  hasReceivedQuoteFromMover?: boolean;
  isQuoteStatusError?: boolean;
  isDesignatedStatusLoading?: boolean;
  /** 처리되지 않은 지정 견적 요청 에러 발생 시 비활성 */
  isDesignatedRequestFailed?: boolean;
  /** `/movers/[id]` 모바일: 지정 CTA 오른쪽 `채팅하기` (지정 완료 후에만) */
  showChatCta?: boolean;
  onChatClick?: () => void;
  isChatPending?: boolean;
  className?: string;
}

/** Tablet / Mobile 하단 sticky — 찜 아이콘 + 지정 견적 CTA */
export const MoverDetailBottomBar = ({
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
  className = '',
}: MoverDetailBottomBarProps) => {
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] xl:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        {showDesignatedCta ? (
          <>
            <motion.div
              className="shrink-0"
              {...(shouldReduceMotion ? {} : tapScale)}
            >
              <FavoriteButton
                variant="icon-only"
                isFavorited={isFavorited}
                isPending={isFavoritePending}
                onClick={onFavoriteClick}
              />
            </motion.div>
            <motion.div
              className="flex-1"
              {...(shouldReduceMotion ? {} : tapScale)}
            >
              <Button
                type="button"
                variant="solid"
                size="sm"
                onClick={onDesignatedQuoteClick}
                disabled={isHardDisabled}
                aria-disabled={isHardDisabled || isSoftBlocked}
                aria-busy={isDesignatedPending || isDesignatedStatusLoading}
                className={cn(
                  'w-full',
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
            {showChatCta ? (
              <motion.div
                className="flex-1"
                {...(shouldReduceMotion ? {} : tapScale)}
              >
                <Button
                  type="button"
                  variant="outlined"
                  size="sm"
                  onClick={onChatClick}
                  disabled={isChatPending}
                  aria-busy={isChatPending}
                  className="w-full"
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
          </>
        ) : (
          <motion.div
            className="w-full"
            {...(shouldReduceMotion ? {} : tapScale)}
          >
            <FavoriteButton
              variant="labeled"
              isFavorited={isFavorited}
              isPending={isFavoritePending}
              onClick={onFavoriteClick}
              className="text-lg-semibold"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

import { motion, useReducedMotion } from 'framer-motion';

import { getMotionTransition } from '@/lib/motionVariants';
import { TOTAL_PROGRESS_STEPS } from '@/types/customerEstimateRequest';

import { EstimateRequestPageHeader } from './EstimateRequestPageHeader';

import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

interface EstimateRequestProgressProps {
  /** FE 시각 스텝 1~4 (화면 분기) */
  currentStep: EstimateRequestVisualStep;
  /**
   * 바 너비·aria용 채움 단계.
   * Step3에서 출발만 완료=3, 도착까지=4 처럼 visualStep과 달라질 수 있음.
   */
  progressFill?: EstimateRequestVisualStep;
}

/**
 * progressbar — 모바일 기본 + md 스케일만 분기
 * - 공통 타이틀 헤더 + 트랙/필 바 (분수 텍스트 없음)
 * - 바 높이: 6px → md 8px / track line-200, fill blue-300
 * - 필 바는 페이지 진입 시 0에서 채워지고, 이후 progressFill이 바뀔 때마다 그 폭으로 애니메이션
 */
export const EstimateRequestProgress = ({
  currentStep,
  progressFill = currentStep,
}: EstimateRequestProgressProps) => {
  const shouldReduceMotion = useReducedMotion();
  const fillPercent = `${(progressFill / TOTAL_PROGRESS_STEPS) * 100}%`;

  return (
    <EstimateRequestPageHeader>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_PROGRESS_STEPS}
        aria-valuenow={progressFill}
        aria-label={`견적 요청 ${progressFill}단계 / 총 ${TOTAL_PROGRESS_STEPS}단계`}
        className="relative w-full"
      >
        {/* 트랙: line-200, 필: blue-300, radius 30px */}
        <div className="h-1.5 w-full overflow-hidden rounded-[1.875rem] bg-line-200 md:h-2">
          <motion.div
            className="h-full rounded-[1.875rem] bg-blue-300"
            initial={{ width: 0 }}
            animate={{ width: fillPercent }}
            transition={getMotionTransition(shouldReduceMotion, {
              duration: 0.4,
              ease: 'easeOut',
            })}
          />
        </div>
      </div>
    </EstimateRequestPageHeader>
  );
};

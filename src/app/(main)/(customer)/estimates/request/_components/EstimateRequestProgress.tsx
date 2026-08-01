import { EstimateRequestPageHeader } from './EstimateRequestPageHeader';
import { TOTAL_PROGRESS_STEPS } from '@/types/customerEstimateRequest';
import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

interface EstimateRequestProgressProps {
  /** FE 시각 스텝 1~4 */
  currentStep: EstimateRequestVisualStep;
}

/** 시각 스텝 → 프로그레스 바 너비 (인라인 style 대신 고정 클래스) */
const PROGRESS_WIDTH_CLASS: Record<EstimateRequestVisualStep, string> = {
  1: 'w-1/4',
  2: 'w-1/2', // 2/4 — Tailwind에 w-2/4 없음
  3: 'w-3/4',
  4: 'w-full',
};

/**
 * Figma `Component/progressbar` — 모바일 기본 + md 스케일만 분기
 * - 공통 타이틀 헤더 + 트랙/필 바 (분수 텍스트 없음)
 * - 바 높이: 6px → md 8px / track line-200, fill blue-300
 */
export const EstimateRequestProgress = ({
  currentStep,
}: EstimateRequestProgressProps) => {
  return (
    <EstimateRequestPageHeader>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_PROGRESS_STEPS}
        aria-valuenow={currentStep}
        aria-label={`견적 요청 ${currentStep}단계 / 총 ${TOTAL_PROGRESS_STEPS}단계`}
        className="relative w-full"
      >
        {/* 트랙: line-200, 필: blue-300, radius 30px */}
        <div className="h-1.5 w-full overflow-hidden rounded-[1.875rem] bg-line-200 md:h-2">
          <div
            className={`h-full rounded-[1.875rem] bg-blue-300 transition-[width] duration-300 ${PROGRESS_WIDTH_CLASS[currentStep]}`}
          />
        </div>
      </div>
    </EstimateRequestPageHeader>
  );
};

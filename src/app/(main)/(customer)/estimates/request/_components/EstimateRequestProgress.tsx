import { TOTAL_PROGRESS_STEPS } from '@/types/customerEstimateRequest';
import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

interface EstimateRequestProgressProps {
  /** FE 시각 스텝 1~4 */
  currentStep: EstimateRequestVisualStep;
}

/**
 * Figma `Component/progressbar` — 모바일 기본 + md 스케일만 분기
 * - 제목 "견적요청" + 트랙/필 바 (분수 텍스트 없음)
 * - 바 높이: 6px → md 8px / track line-200, fill blue-300
 */
export const EstimateRequestProgress = ({
  currentStep,
}: EstimateRequestProgressProps) => {
  const progressPercent = (currentStep / TOTAL_PROGRESS_STEPS) * 100;

  return (
    <header className="w-full bg-white py-6 shadow-page-title md:py-8">
      <div className="mx-auto flex w-full max-w-[375px] flex-col gap-4 px-6 md:max-w-[1448px] md:gap-6">
        <h1 className="text-2lg-semibold text-black-400 md:text-2xl-semibold">
          견적요청
        </h1>
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
              className="h-full rounded-[1.875rem] bg-blue-300 transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

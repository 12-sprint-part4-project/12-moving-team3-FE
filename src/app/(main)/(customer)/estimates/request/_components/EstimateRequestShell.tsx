import type { ReactNode } from 'react';

import { EstimateRequestProgress } from './EstimateRequestProgress';
import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

interface EstimateRequestShellProps {
  currentStep: EstimateRequestVisualStep;
  /** Step3 출발/도착 세분 등 — 바 너비만 visualStep과 다르게 줄 때 */
  progressFill?: EstimateRequestVisualStep;
  children: ReactNode;
}

/**
 * 견적요청 레이아웃 — GNB 아래 progressbar(풀폭) + 채팅 컨텐츠 영역.
 */
export const EstimateRequestShell = ({
  currentStep,
  progressFill,
  children,
}: EstimateRequestShellProps) => {
  return (
    <div className="flex w-full flex-col bg-background-200">
      <EstimateRequestProgress
        currentStep={currentStep}
        progressFill={progressFill}
      />

      <div
        className="flex w-full flex-col gap-4 py-6 md:py-[3rem]"
        aria-live="polite"
        aria-relevant="additions"
      >
        {children}
      </div>
    </div>
  );
};

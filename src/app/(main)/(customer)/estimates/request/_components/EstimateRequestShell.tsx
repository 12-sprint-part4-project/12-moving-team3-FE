import type { ReactNode } from 'react';

import { EstimateRequestProgress } from './EstimateRequestProgress';
import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

interface EstimateRequestShellProps {
  currentStep: EstimateRequestVisualStep;
  children: ReactNode;
}

/**
 * 견적요청 레이아웃 — GNB 아래 progressbar(풀폭) + 채팅 컨텐츠 영역.
 */
export const EstimateRequestShell = ({
  currentStep,
  children,
}: EstimateRequestShellProps) => {
  return (
    <div className="flex w-full flex-col bg-background-200">
      <EstimateRequestProgress currentStep={currentStep} />

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

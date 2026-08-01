import type { ReactNode } from 'react';

import EstimateRequestProgress from './EstimateRequestProgress';
import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

interface EstimateRequestShellProps {
  currentStep: EstimateRequestVisualStep;
  children: ReactNode;
}

/**
 * 견적요청 레이아웃 — GNB 아래 progressbar(풀폭) + 채팅 컨텐츠 영역.
 * 채팅 버블·수정하기 UI는 이후 스프린트에서 채운다.
 */
const EstimateRequestShell = ({
  currentStep,
  children,
}: EstimateRequestShellProps) => {
  return (
    <div className="flex w-full flex-col">
      <EstimateRequestProgress currentStep={currentStep} />

      <div
        className="flex w-full flex-col gap-4 bg-background-200 py-6 md:py-[3rem]"
        aria-live="polite"
        aria-relevant="additions"
      >
        {children}
      </div>
    </div>
  );
};

export default EstimateRequestShell;

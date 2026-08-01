'use client';

import { EstimateRequestBlocked } from './_components/EstimateRequestBlocked';
import { EstimateRequestGate } from './_components/EstimateRequestGate';
import { EstimateRequestShell } from './_components/EstimateRequestShell';
import { AddressStep } from './_components/steps/AddressStep';
import { MoveDateStep } from './_components/steps/MoveDateStep';
import { MoveTypeStep } from './_components/steps/MoveTypeStep';
import { SubmitStep } from './_components/steps/SubmitStep';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';

/**
 * 견적요청 페이지 클라이언트 — bootstrap 분기 + 스텝 렌더.
 * 비회원·프로필 미등록: Shell + 채팅형 Gate.
 * 진행중(blocked): EstimateRequestBlocked.
 * 일반 에러: 훅에서 토스트 + 자동 재시도 → 로딩 UI 유지.
 */
export const EstimateRequestPageClient = () => {
  const { bootstrap } = useCustomerEstimateRequest();

  // loading · 일반 에러(자동 재시도 중) 공통 — 풀페이지 에러 화면 없음
  if (bootstrap.status === 'loading' || bootstrap.status === 'error') {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-18">
        <p className="text-gray-400 text-lg-medium" role="status">
          견적 요청을 준비하는 중…
        </p>
      </div>
    );
  }

  // 비회원·프로필 미등록 — Step1과 같은 Shell + 채팅 게이트
  if (
    bootstrap.status === 'unauthorized' ||
    bootstrap.status === 'profileIncomplete'
  ) {
    return (
      <EstimateRequestShell currentStep={1}>
        <EstimateRequestGate kind={bootstrap.status} />
      </EstimateRequestShell>
    );
  }

  // 제출 직후·활성 요청 재진입 공통
  if (bootstrap.status === 'blocked') {
    return (
      <EstimateRequestBlocked
        message={
          <>
            현재 진행 중인 이사 견적이 있어요!
            <br />
            진행 중인 이사 완료 후 새로운 견적을 받아보세요.
          </>
        }
        actionLabel="받은 견적 보러가기"
        actionHref="/quotes"
      />
    );
  }

  // ready — 시각 스텝에 맞는 렌더
  const { visualStep, detail } = bootstrap;

  return (
    <EstimateRequestShell currentStep={visualStep}>
      {visualStep === 1 ? <MoveTypeStep /> : null}
      {visualStep === 2 ? <MoveDateStep /> : null}
      {visualStep === 3 ? <AddressStep /> : null}
      {visualStep === 4 ? <SubmitStep detail={detail} /> : null}
    </EstimateRequestShell>
  );
};

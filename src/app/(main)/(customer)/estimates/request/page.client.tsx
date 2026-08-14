'use client';

import { useEffect, useState } from 'react';

import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';

import { EstimateRequestBlocked } from './_components/EstimateRequestBlocked';
import { EstimateRequestShell } from './_components/EstimateRequestShell';
import { AddressStep } from './_components/steps/AddressStep';
import { MoveDateStep } from './_components/steps/MoveDateStep';
import { MoveTypeStep } from './_components/steps/MoveTypeStep';

import type { EstimateRequestVisualStep } from '@/types/customerEstimateRequest';

/** step별 탭 타이틀 — 절대 문자열(| 무빙 포함, 루트 template 이중 적용 방지) */
const ESTIMATE_REQUEST_TITLE_BY_STEP: Record<1 | 2 | 3, string> = {
  1: '견적 요청 Step 1 이사유형 선택 | 무빙',
  2: '견적 요청 Step 2 이사일자 선택 | 무빙',
  3: '견적 요청 Step 3 출발/도착지 선택 | 무빙',
};

const ESTIMATE_REQUEST_FALLBACK_TITLE = '견적요청 | 무빙';

/**
 * 견적요청 페이지 클라이언트 — bootstrap 분기 + 스텝 렌더.
 * 비회원·프로필 미등록은 라우트 가드가 먼저 막아서 이 컴포넌트는 항상 인증·프로필 완료 상태로만 마운트된다.
 * 진행중(blocked): EstimateRequestBlocked (제출 직후·재진입 공통).
 * 일반 에러: 훅에서 토스트 + 자동 재시도 → 로딩 UI 유지.
 * 확인용 Step4 UI 없음 — Step3 「견적 확정하기」에서 submit.
 */
export const EstimateRequestPageClient = () => {
  const { bootstrap } = useCustomerEstimateRequest();
  // Step3 로컬 draft 기준 — 미선택 2/4 → 출발 3/4 → 도착 full
  const [step3ProgressFill, setStep3ProgressFill] =
    useState<EstimateRequestVisualStep>(2);

  // bootstrap·visualStep에 맞춰 브라우저 탭 타이틀 동기화
  useEffect(() => {
    if (
      bootstrap.status === 'loading' ||
      bootstrap.status === 'error' ||
      bootstrap.status === 'blocked'
    ) {
      document.title = ESTIMATE_REQUEST_FALLBACK_TITLE;
      return;
    }

    if (bootstrap.status === 'ready') {
      const step = bootstrap.visualStep;
      // UI는 1~3만 — 타입상 4가 와도 Step3 타이틀로 처리
      document.title =
        step === 1 || step === 2 || step === 3
          ? ESTIMATE_REQUEST_TITLE_BY_STEP[step]
          : ESTIMATE_REQUEST_TITLE_BY_STEP[3];
    }
  }, [bootstrap]);

  // loading · 일반 에러(자동 재시도 중) 공통 — 공용 Spinner로 톤 맞춤
  if (bootstrap.status === 'loading' || bootstrap.status === 'error') {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-18">
        <Spinner message="견적 요청을 준비하는 중…" />
      </div>
    );
  }

  // 제출 직후·활성 요청 재진입 공통
  if (bootstrap.status === 'blocked') {
    const isConfirmed = bootstrap.blockedRequest?.status === 'CONFIRMED';

    return (
      <EstimateRequestBlocked
        message={
          <>
            현재 진행 중인 이사 견적이 있어요!
            <br />
            진행 중인 이사 완료 후 새로운 견적을 받아보세요.
          </>
        }
        actionLabel={isConfirmed ? '이용 내역 보기' : '받은 견적 보러가기'}
        actionHref={isConfirmed ? '/quotes/history' : '/quotes'}
      />
    );
  }

  // ready — 시각 스텝에 맞는 렌더 (입력은 1~3만)
  const { visualStep } = bootstrap;
  const progressFill: EstimateRequestVisualStep =
    visualStep === 3 ? step3ProgressFill : visualStep;

  return (
    <EstimateRequestShell currentStep={visualStep} progressFill={progressFill}>
      {visualStep === 1 ? <MoveTypeStep /> : null}
      {visualStep === 2 ? <MoveDateStep /> : null}
      {visualStep === 3 ? (
        <AddressStep onProgressFillChange={setStep3ProgressFill} />
      ) : null}
    </EstimateRequestShell>
  );
};

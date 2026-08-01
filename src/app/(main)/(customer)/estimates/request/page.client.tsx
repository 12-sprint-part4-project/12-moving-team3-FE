'use client';

import { EstimateRequestBlocked } from './_components/EstimateRequestBlocked';
import { EstimateRequestShell } from './_components/EstimateRequestShell';
import { AddressStep } from './_components/steps/AddressStep';
import { MoveDateStep } from './_components/steps/MoveDateStep';
import { MoveTypeStep } from './_components/steps/MoveTypeStep';
import { SubmitStep } from './_components/steps/SubmitStep';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';

/**
 * 견적요청 페이지 클라이언트 — bootstrap 분기 + 스텝 스텁 렌더.
 * 비정상/진행중 안내는 EstimateRequestBlocked 로 통일.
 */
export const EstimateRequestPageClient = () => {
  const { bootstrap } = useCustomerEstimateRequest();

  if (bootstrap.status === 'loading') {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-18">
        <p className="text-gray-400 text-lg-medium" role="status">
          견적 요청을 준비하는 중…
        </p>
      </div>
    );
  }

  if (bootstrap.status === 'unauthorized') {
    return (
      <EstimateRequestBlocked
        message="견적 요청은 로그인 후 이용할 수 있습니다."
        actionLabel="로그인하러 가기"
        actionHref="/login"
      />
    );
  }

  if (bootstrap.status === 'profileIncomplete') {
    return (
      <EstimateRequestBlocked
        message="견적 요청을 하려면 프로필 등록이 필요합니다."
        actionLabel="프로필 등록하러 가기"
        actionHref="/profile/customer"
      />
    );
  }

  // 제출 직후·활성 요청 재진입 공통 (Figma 1-11375)
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

  if (bootstrap.status === 'error') {
    return (
      <EstimateRequestBlocked
        message={
          bootstrap.error?.message ??
          '견적 요청을 불러오는 중 오류가 발생했습니다.'
        }
        actionLabel="다시 시도"
        role="alert"
        onActionClick={() => {
          void bootstrap.refetch();
        }}
      />
    );
  }

  // ready — 시각 스텝에 맞는 스텁 렌더
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

'use client';

import Link from 'next/link';

import { EstimateRequestShell } from './_components/EstimateRequestShell';
import { AddressStep } from './_components/steps/AddressStep';
import { MoveDateStep } from './_components/steps/MoveDateStep';
import { MoveTypeStep } from './_components/steps/MoveTypeStep';
import { SubmitStep } from './_components/steps/SubmitStep';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';

/**
 * 견적요청 페이지 클라이언트 — bootstrap 분기 + 스텝 스텁 렌더.
 * 스텝별 Figma UI·mutation 연결은 스프린트2~5에서 진행.
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

  // 로그인 필요 — 인증 페이지 경로가 확정되면 href만 교체
  if (bootstrap.status === 'unauthorized') {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 sm:px-18">
        <h1 className="text-black-400 text-2lg-bold">견적 요청</h1>
        <p className="text-gray-500 text-lg-medium">
          견적 요청은 로그인 후 이용할 수 있습니다.
        </p>
        <Link
          href="/login/customer"
          className="text-blue-300 text-lg-semibold w-fit underline"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  // 프로필 미등록 — 프로필 등록 경로가 확정되면 href만 교체
  if (bootstrap.status === 'profileIncomplete') {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 sm:px-18">
        <h1 className="text-black-400 text-2lg-bold">견적 요청</h1>
        <p className="text-gray-500 text-lg-medium">
          견적 요청을 하려면 프로필 등록이 필요합니다.
        </p>
        <Link
          href="/profile/customer"
          className="text-blue-300 text-lg-semibold w-fit underline"
        >
          프로필 등록하러 가기
        </Link>
      </div>
    );
  }

  // 이미 활성 요청(SUBMITTED/CONFIRMED 등)이 있어 신규 DRAFT 생성 불가
  if (bootstrap.status === 'blocked') {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 sm:px-18">
        <h1 className="text-black-400 text-2lg-bold">견적 요청</h1>
        <p className="text-gray-500 text-lg-medium">
          진행 중인 견적 요청이 있어 새로운 요청을 만들 수 없습니다.
        </p>
        {bootstrap.blockedRequest ? (
          <p className="text-md-regular text-gray-400">
            상태: {bootstrap.blockedRequest.status}
            {bootstrap.blockedRequest.moveDate
              ? ` · 이사일 ${bootstrap.blockedRequest.moveDate}`
              : ''}
          </p>
        ) : null}
        <Link
          href="/quotes"
          className="text-blue-300 text-lg-semibold w-fit underline"
        >
          내 견적 관리로 이동
        </Link>
      </div>
    );
  }

  if (bootstrap.status === 'error') {
    return (
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 sm:px-18">
        <h1 className="text-black-400 text-2lg-bold">견적 요청</h1>
        <p className="text-gray-500 text-lg-medium" role="alert">
          {bootstrap.error?.message ??
            '견적 요청을 불러오는 중 오류가 발생했습니다.'}
        </p>
        <button
          type="button"
          onClick={() => {
            void bootstrap.refetch();
          }}
          className="text-blue-300 text-lg-semibold w-fit underline"
        >
          다시 시도
        </button>
      </div>
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

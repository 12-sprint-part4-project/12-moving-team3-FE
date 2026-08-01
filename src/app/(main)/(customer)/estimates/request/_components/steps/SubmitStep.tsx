import type { EstimateRequestDetail } from '@/types/customerEstimateRequest';

interface SubmitStepProps {
  detail: EstimateRequestDetail | null;
}

/**
 * 스텝4 — 확인/제출 (Figma 1-11375).
 * 스프린트5에서 요약 UI·POST submit 연동 구현.
 */
export const SubmitStep = ({ detail }: SubmitStepProps) => {
  return (
    <section
      aria-label="견적 요청 확인 및 제출"
      className="mx-auto flex w-full max-w-[375px] flex-col gap-3 px-6 md:max-w-[1448px]"
    >
      <p className="text-lg-medium text-black-400">
        입력하신 내용을 확인해 주세요. (스텝4 스텁)
      </p>
      {detail ? (
        <dl className="flex flex-col gap-1 text-md-regular text-gray-500">
          <div>
            <dt className="inline">이사 종류: </dt>
            <dd className="inline">{detail.moveType ?? '-'}</dd>
          </div>
          <div>
            <dt className="inline">이사일: </dt>
            <dd className="inline">{detail.moveDate ?? '-'}</dd>
          </div>
          <div>
            <dt className="inline">출발지: </dt>
            <dd className="inline">{detail.departureAddress ?? '-'}</dd>
          </div>
          <div>
            <dt className="inline">도착지: </dt>
            <dd className="inline">{detail.arrivalAddress ?? '-'}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
};

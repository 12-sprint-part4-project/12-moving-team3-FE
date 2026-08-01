import type { EstimateRequestDetail } from '@/types/customerEstimateRequest';

interface SubmitStepProps {
  detail: EstimateRequestDetail | null;
}

/**
 * 스텝4 — 제출 전 확인 UI (채팅 요약·제출 버튼).
 * 제출 성공 화면은 별도가 아니라 `EstimateRequestBlocked`(진행 중 안내)와 동일.
 * submit → bootstrap refetch → status blocked 로 전환된다.
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

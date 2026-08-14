import { SERVICE_CHIP_OPTIONS } from '@/constants/commonOptions';

import type { ApiMoveType } from '@/types/estimateRequest';

export interface MoveTypeSelectOption {
  value: ApiMoveType;
  label: string;
}

/** 이사종류별 상세 설명 — 견적요청 Step1~3 전용 부가 문구(짧은 라벨은 SERVICE_CHIP_OPTIONS 재사용) */
const MOVE_TYPE_DETAIL: Record<ApiMoveType, string> = {
  SMALL: '(원룸, 투룸, 20평대 미만)',
  HOME: '(쓰리룸, 20평대 이상)',
  OFFICE: '(사무실, 상업공간)',
};

/** 견적요청 이사종류 질문 — Step1~3 공용, 답변 라벨·수정 패널 옵션 */
export const MOVE_TYPE_OPTIONS: ReadonlyArray<MoveTypeSelectOption> =
  SERVICE_CHIP_OPTIONS.map(({ value, label }) => ({
    value,
    label: `${label} ${MOVE_TYPE_DETAIL[value]}`,
  }));

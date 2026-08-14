import { SERVICE_CHIP_OPTIONS } from '@/constants/commonOptions';

import type { ApiMoveType } from '@/types/estimateRequest';

export interface MoveTypeSelectOption {
  value: ApiMoveType;
  label: string;
}

/** 견적요청 이사종류 질문 — Step1~3 공용, 답변 라벨·수정 패널 옵션. SSOT는 SERVICE_CHIP_OPTIONS */
export const MOVE_TYPE_OPTIONS: ReadonlyArray<MoveTypeSelectOption> =
  SERVICE_CHIP_OPTIONS.map(({ value, label, detail }) => ({
    value,
    label: `${label} ${detail}`,
  }));

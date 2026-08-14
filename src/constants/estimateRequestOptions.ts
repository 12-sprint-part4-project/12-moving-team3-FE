import type { ApiMoveType } from '@/types/estimateRequest';

export interface MoveTypeSelectOption {
  value: ApiMoveType;
  label: string;
}

/** 견적요청 이사종류 질문 — Step1~3 공용, 답변 라벨·수정 패널 옵션 */
export const MOVE_TYPE_OPTIONS: ReadonlyArray<MoveTypeSelectOption> = [
  { value: 'SMALL', label: '소형이사 (원룸, 투룸, 20평대 미만)' },
  { value: 'HOME', label: '가정이사 (쓰리룸, 20평대 이상)' },
  { value: 'OFFICE', label: '사무실이사 (사무실, 상업공간)' },
];

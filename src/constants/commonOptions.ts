import type { ApiMoveType } from '@/types/estimateRequest';

/** 서비스(이사 유형) — 칩/폼용 (전체 없음). `detail`은 견적요청 Step1~3 질문에서만 라벨에 덧붙여 쓴다 */
export const SERVICE_CHIP_OPTIONS: ReadonlyArray<{
  label: string;
  value: ApiMoveType;
  detail: string;
}> = [
  { label: '소형이사', value: 'SMALL', detail: '(원룸, 투룸, 20평대 미만)' },
  { label: '가정이사', value: 'HOME', detail: '(쓰리룸, 20평대 이상)' },
  { label: '사무실이사', value: 'OFFICE', detail: '(사무실, 상업공간)' },
];

/** 지역 — 칩/폼용 (전체 없음) */
export const REGION_CHIP_OPTIONS = [
  { label: '서울', value: 'SEOUL' },
  { label: '경기', value: 'GYEONGGI' },
  { label: '인천', value: 'INCHEON' },
  { label: '강원', value: 'GANGWON' },
  { label: '충북', value: 'CHUNGBUK' },
  { label: '충남', value: 'CHUNGNAM' },
  { label: '세종', value: 'SEJONG' },
  { label: '대전', value: 'DAEJEON' },
  { label: '전북', value: 'JEONBUK' },
  { label: '광주/전남', value: 'GWANGJU_JEONNAM' },
  { label: '경북', value: 'GYEONGBUK' },
  { label: '경남', value: 'GYEONGNAM' },
  { label: '대구', value: 'DAEGU' },
  { label: '울산', value: 'ULSAN' },
  { label: '부산', value: 'BUSAN' },
  { label: '제주', value: 'JEJU' },
] as const;

export type ServiceChipValue = ApiMoveType;
export type RegionChipValue = (typeof REGION_CHIP_OPTIONS)[number]['value'];

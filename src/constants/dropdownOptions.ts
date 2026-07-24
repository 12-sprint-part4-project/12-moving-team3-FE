export interface DropdownOption {
  /** 화면에 표시될 텍스트 */
  label: string;
  /** 실제 전달할 값 */
  value: string;
}

export type DropdownType = 'region' | 'service';

export const REGION_OPTIONS: DropdownOption[] = [
  { label: '전체', value: 'ALL' },
  { label: '서울', value: 'SEOUL' },
  { label: '경기', value: 'GYEONGGI' },
  { label: '인천', value: 'INCHEON' },
  { label: '강원', value: 'GANGWON' },
  { label: '충북', value: 'CHUNGBUK' },
  { label: '충남', value: 'CHUNGNAM' },
  { label: '세종', value: 'SEJONG' },
  { label: '대전', value: 'DAEJEON' },
  { label: '전북', value: 'JEONBUK' },
  { label: '전남', value: 'JEONNAM' },
  { label: '광주', value: 'GWANGJU' },
  { label: '경북', value: 'GYEONGBUK' },
  { label: '대구', value: 'DAEGU' },
  { label: '울산', value: 'ULSAN' },
  { label: '부산', value: 'BUSAN' },
  { label: '경남', value: 'GYEONGNAM' },
  { label: '제주', value: 'JEJU' },
];

export const SERVICE_OPTIONS: DropdownOption[] = [
  { label: '전체', value: 'ALL' },
  { label: '소형이사', value: 'SMALL' },
  { label: '가정이사', value: 'HOME' },
  { label: '사무실이사', value: 'OFFICE' },
];

export const TYPE_LABELS = {
  region: '지역',
  service: '서비스',
} as const;

export const OPTIONS_BY_TYPE = {
  region: REGION_OPTIONS,
  service: SERVICE_OPTIONS,
} as const;

import {
  REGION_CHIP_OPTIONS,
  SERVICE_CHIP_OPTIONS,
} from '@/constants/commonOptions';

export interface DropdownOption {
  /** 화면에 표시될 텍스트 */
  label: string;
  /** 실제 전달할 값 */
  value: string;
}

export type DropdownType = 'region' | 'service';

export const REGION_OPTIONS: DropdownOption[] = [
  { label: '전체', value: 'ALL' },
  ...REGION_CHIP_OPTIONS,
];

export const SERVICE_OPTIONS: DropdownOption[] = [
  { label: '전체', value: 'ALL' },
  ...SERVICE_CHIP_OPTIONS,
];

export const TYPE_LABELS = {
  region: '지역',
  service: '서비스',
} as const;

export const OPTIONS_BY_TYPE = {
  region: REGION_OPTIONS,
  service: SERVICE_OPTIONS,
} as const;

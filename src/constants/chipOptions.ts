/**
 * 서비스·지역 선택 칩 등에서 공통으로 쓰는 옵션 ('전체' 제외).
 */

export const SERVICE_CHIP_OPTIONS = [
  { label: '소형이사', value: 'SMALL' },
  { label: '가정이사', value: 'HOME' },
  { label: '사무실이사', value: 'OFFICE' },
] as const;

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

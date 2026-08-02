import type { AddressSearchItem } from '@/types/addressSearch';

/** 행안부 도로명주소 검색 API (서버 전용 호출) */
export const JUSO_ADDR_LINK_API_URL =
  'https://business.juso.go.kr/addrlink/addrLinkApi.do';

/** 신청·스펙 안내: https://business.juso.go.kr/jst/jstRoadNmAddrApiSearch */
export const JUSO_API_DOCS_URL =
  'https://business.juso.go.kr/jst/jstRoadNmAddrApiSearch';

const DEFAULT_COUNT_PER_PAGE = 10;
const MAX_COUNT_PER_PAGE = 50;

/** 키 없을 때 UI 검증용 — Figma AddressCard 샘플에 맞춤 */
export const JUSO_MOCK_ADDRESSES: AddressSearchItem[] = [
  {
    id: 'mock-04538-samil',
    zipCode: '04538',
    roadAddress:
      '서울 중구 삼일대로 343 (대신파이낸스센터 Daishin Finance Center)',
    lotAddress: '서울 중구 저동1가 114',
  },
  {
    id: 'mock-06236-teheran',
    zipCode: '06236',
    roadAddress: '서울 강남구 테헤란로 152',
    lotAddress: '서울 강남구 역삼동 737',
  },
];

/**
 * 행안부 권장: SQL 예약어·특수문자로 IP 차단되는 경우 대비 간단 필터.
 * 완전 제거가 아니라 검색어에서 위험 토큰만 공백 처리한다.
 */
export const sanitizeJusoKeyword = (raw: string): string => {
  const reserved =
    /\b(OR|SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b/gi;
  return raw
    .replace(reserved, ' ')
    .replace(/[%<>"=']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const clampJusoPageSize = (value: number | undefined): number => {
  if (value == null || Number.isNaN(value)) {
    return DEFAULT_COUNT_PER_PAGE;
  }
  return Math.min(Math.max(1, Math.floor(value)), MAX_COUNT_PER_PAGE);
};

interface JusoCommon {
  errorCode?: string;
  errorMessage?: string;
  totalCount?: string;
  currentPage?: string;
}

interface JusoRow {
  bdMgtSn?: string;
  zipNo?: string;
  roadAddr?: string;
  jibunAddr?: string;
}

interface JusoApiJson {
  results?: {
    common?: JusoCommon;
    juso?: JusoRow[] | null;
  };
}

export interface SearchJusoAddressesParams {
  keyword: string;
  currentPage?: number;
  countPerPage?: number;
  confmKey: string;
}

export interface SearchJusoAddressesResult {
  addresses: AddressSearchItem[];
  totalCount: number;
  currentPage: number;
}

/** 행안부 JSON 1건 → AddressSearchItem */
export const mapJusoRowToAddressItem = (row: JusoRow): AddressSearchItem | null => {
  const zipCode = row.zipNo?.trim() ?? '';
  const roadAddress = row.roadAddr?.trim() ?? '';
  const lotAddress = row.jibunAddr?.trim() ?? '';

  if (!zipCode || !roadAddress) {
    return null;
  }

  const id =
    row.bdMgtSn?.trim() ||
    `${zipCode}-${roadAddress}-${lotAddress}`.slice(0, 120);

  return { id, zipCode, roadAddress, lotAddress };
};

/**
 * 행안부 addrLinkApi.do 실호출 (Route Handler / 서버에서만).
 * errorCode !== '0' 이면 Error throw.
 */
export const searchJusoAddresses = async (
  params: SearchJusoAddressesParams
): Promise<SearchJusoAddressesResult> => {
  const keyword = sanitizeJusoKeyword(params.keyword);
  const currentPage = Math.max(1, Math.floor(params.currentPage ?? 1));
  const countPerPage = clampJusoPageSize(params.countPerPage);

  const url = new URL(JUSO_ADDR_LINK_API_URL);
  url.searchParams.set('confmKey', params.confmKey);
  url.searchParams.set('currentPage', String(currentPage));
  url.searchParams.set('countPerPage', String(countPerPage));
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('resultType', 'json');

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`행안부 주소 API HTTP ${response.status}`);
  }

  const body = (await response.json()) as JusoApiJson;
  const common = body.results?.common;
  const errorCode = common?.errorCode ?? '';

  if (errorCode !== '0') {
    const message =
      common?.errorMessage?.trim() ||
      `행안부 주소 검색에 실패했습니다. (${errorCode || 'UNKNOWN'})`;
    throw new Error(message);
  }

  const rows = body.results?.juso ?? [];
  const addresses = rows
    .map(mapJusoRowToAddressItem)
    .filter((item): item is AddressSearchItem => item != null);

  const totalCount = Number(common?.totalCount ?? addresses.length);

  return {
    addresses,
    totalCount: Number.isFinite(totalCount) ? totalCount : addresses.length,
    currentPage,
  };
};

/** mock: keyword 포함 여부로 fixture 필터 (빈 키워드는 전체) */
export const searchJusoMockAddresses = (
  keyword: string,
  currentPage = 1
): SearchJusoAddressesResult => {
  const normalized = sanitizeJusoKeyword(keyword).toLowerCase();
  const filtered =
    normalized.length === 0
      ? JUSO_MOCK_ADDRESSES
      : JUSO_MOCK_ADDRESSES.filter(
          (item) =>
            item.roadAddress.toLowerCase().includes(normalized) ||
            item.lotAddress.toLowerCase().includes(normalized) ||
            item.zipCode.includes(normalized)
        );

  return {
    addresses: filtered,
    totalCount: filtered.length,
    currentPage: Math.max(1, currentPage),
  };
};

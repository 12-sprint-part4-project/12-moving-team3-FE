import { NextResponse } from 'next/server';

import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  JUSO_API_DOCS_URL,
  sanitizeJusoKeyword,
  searchJusoAddresses,
  searchJusoMockAddresses,
} from '@/lib/jusoAddressSearch';

import type { AddressSearchResult } from '@/types/addressSearch';

/** 검색어 최소 길이 — 1자 요청으로 행안부 부하·차단 완화 */
const MIN_KEYWORD_LENGTH = 2;

/** 주소 검색 실패 응답 — code·status·message를 한 항목에 묶음 */
const ADDRESS_SEARCH_ERRORS = {
  INVALID_KEYWORD: {
    code: API_ERROR_CODE.INVALID_KEYWORD,
    status: 400,
    message: '검색어를 2자 이상 입력해 주세요.',
  },
  ADDRESS_SEARCH_FAILED: {
    code: API_ERROR_CODE.ADDRESS_SEARCH_FAILED,
    status: 502,
    message: '주소 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  },
} as const;

type AddressSearchError =
  (typeof ADDRESS_SEARCH_ERRORS)[keyof typeof ADDRESS_SEARCH_ERRORS];

const jsonAddressSearchError = (error: AddressSearchError) =>
  NextResponse.json(
    { success: false, message: error.message, code: error.code },
    { status: error.status }
  );

/**
 * GET /api/addresses?keyword=&page=
 * 행안부 도로명주소 API 프록시. confmKey(JUSO_API_KEY)는 서버에만 둔다.
 * 키 없으면 mock fixture 반환 → 키 발급 전 UI 연동 가능.
 *
 * @see https://business.juso.go.kr/jst/jstRoadNmAddrApiSearch
 */
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const rawKeyword = searchParams.get('keyword') ?? '';
  const keyword = sanitizeJusoKeyword(rawKeyword);
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

  if (keyword.length < MIN_KEYWORD_LENGTH) {
    return jsonAddressSearchError(ADDRESS_SEARCH_ERRORS.INVALID_KEYWORD);
  }

  const confmKey = process.env.JUSO_API_KEY?.trim() ?? '';

  try {
    if (!confmKey) {
      // 키 미발급·미설정 — mock으로 계약 유지
      const mock = searchJusoMockAddresses(keyword, currentPage);
      const data: AddressSearchResult = {
        ...mock,
        isMock: true,
      };
      return NextResponse.json({ success: true, data });
    }

    const result = await searchJusoAddresses({
      keyword,
      currentPage,
      confmKey,
    });
    const data: AddressSearchResult = {
      ...result,
      isMock: false,
    };
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // 행안부 원문(키/IP/쿼터 등)은 서버 로그만 — 클라이언트에는 고정 문구
    const detail =
      error instanceof Error
        ? error.message
        : '주소 검색 중 오류가 발생했습니다.';

    console.error('[addresses]', detail, {
      docs: JUSO_API_DOCS_URL,
    });

    return jsonAddressSearchError(ADDRESS_SEARCH_ERRORS.ADDRESS_SEARCH_FAILED);
  }
};

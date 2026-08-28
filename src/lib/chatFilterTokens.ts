/**
 * 채팅 필터 토큰 파싱·표시 action 판별.
 * BE mask 결과의 [전화번호]/[계좌번호] 토큰과
 * filterAction/filterReasonCodes(BE #432)를 말풍선 UI에 연결한다 (#357).
 */

import type {
  ChatFilterAction,
  ChatFilterReasonCode,
  ChatMessage,
} from '@/types/chat';

export type FilterTokenType = 'phone' | 'account';

export interface FilterTextPart {
  type: 'text';
  value: string;
}

export interface FilterTokenPart {
  type: 'token';
  tokenType: FilterTokenType;
  /** 말풍선 본문에 표시할 라벨 */
  label: string;
}

export type FilterContentPart = FilterTextPart | FilterTokenPart;

/** 말풍선 UI 분기용 표시 action */
export type FilterDisplayAction = 'allow' | 'mask' | 'block' | 'profanity';

const createTokenPattern = (): RegExp => /(\[전화번호\]|\[계좌번호\])/g;

const TOKEN_MAP: Record<string, FilterTokenPart> = {
  '[전화번호]': { type: 'token', tokenType: 'phone', label: '연락처' },
  '[계좌번호]': { type: 'token', tokenType: 'account', label: '계좌 정보' },
};

/**
 * content 문자열을 텍스트 파트와 토큰 파트로 분리한다.
 * 토큰이 없으면 텍스트 파트 1개짜리 배열을 반환한다.
 */
export const parseFilterContent = (content: string): FilterContentPart[] => {
  const parts: FilterContentPart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(createTokenPattern())) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    const token = TOKEN_MAP[match[0]];
    if (token) {
      parts.push(token);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', value: content }];
};

/** 목록·드롭다운 미리보기용 — 토큰을 라벨 텍스트로 치환한다. */
export const formatFilterContentPreview = (content: string): string =>
  parseFilterContent(content)
    .map((part) => (part.type === 'token' ? part.label : part.value))
    .join('');

const PROFANITY_MESSAGE =
  '부적절한 언어 사용이 감지되었습니다. 반복될 경우 제재가 진행됩니다.';

/**
 * isFiltered + content를 보고 표시 방식을 결정한다 (이력 GET fallback).
 * - profanity: 욕설 안내 문구 포함
 * - mask: [전화번호] / [계좌번호] 토큰 포함 → 수신자는 칩 치환
 * - block: 개인정보 단독 → 안내 문구
 * - allow: 필터 없음
 */
export const getFilterAction = (
  isFiltered: boolean,
  content: string
): FilterDisplayAction => {
  if (!isFiltered) {
    return 'allow';
  }

  if (content.includes(PROFANITY_MESSAGE)) {
    return 'profanity';
  }

  return createTokenPattern().test(content) ? 'mask' : 'block';
};

/**
 * BE `filterAction` + `filterReasonCodes` → 말풍선 표시 action.
 * `block` + PROFANITY → `profanity`, 그 외 block → `block`.
 */
const fromBeFilterFields = (
  filterAction: ChatFilterAction,
  filterReasonCodes: ChatFilterReasonCode[] = []
): FilterDisplayAction => {
  if (filterAction === 'allow') {
    return 'allow';
  }
  if (filterAction === 'mask') {
    return 'mask';
  }
  return filterReasonCodes.includes('PROFANITY') ? 'profanity' : 'block';
};

/**
 * 메시지 표시 action을 결정한다 (#357).
 * - `filterAction`이 있으면 BE 필드 우선
 * - 없으면(이력 GET) `getFilterAction` content fallback
 */
export const resolveFilterDisplayAction = (
  message: Pick<
    ChatMessage,
    'isFiltered' | 'content' | 'filterAction' | 'filterReasonCodes'
  >
): FilterDisplayAction => {
  if (message.filterAction !== undefined) {
    return fromBeFilterFields(
      message.filterAction,
      message.filterReasonCodes ?? []
    );
  }

  return getFilterAction(message.isFiltered, message.content);
};

export { PROFANITY_MESSAGE };

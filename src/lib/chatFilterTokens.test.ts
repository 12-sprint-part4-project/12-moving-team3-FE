import { describe, expect, it } from 'vitest';

import {
  formatFilterContentPreview,
  getFilterAction,
  parseFilterContent,
  PROFANITY_MESSAGE,
  resolveFilterDisplayAction,
} from './chatFilterTokens';

describe('parseFilterContent', () => {
  it('토큰 없으면 텍스트 파트 1개', () => {
    expect(parseFilterContent('안녕하세요')).toEqual([
      { type: 'text', value: '안녕하세요' },
    ]);
  });

  it('[전화번호]·[계좌번호] 토큰을 분리한다', () => {
    expect(parseFilterContent('연락처 [전화번호] / [계좌번호]')).toEqual([
      { type: 'text', value: '연락처 ' },
      { type: 'token', tokenType: 'phone', label: '연락처' },
      { type: 'text', value: ' / ' },
      { type: 'token', tokenType: 'account', label: '계좌 정보' },
    ]);
  });
});

describe('formatFilterContentPreview', () => {
  it('토큰을 라벨로 치환한다', () => {
    expect(formatFilterContentPreview('연락처 [전화번호]')).toBe(
      '연락처 연락처'
    );
  });
});

describe('getFilterAction (이력 fallback)', () => {
  it('isFiltered=false면 allow', () => {
    expect(getFilterAction(false, '안녕')).toBe('allow');
  });

  it('욕설 안내 문구가 있으면 profanity', () => {
    expect(getFilterAction(true, PROFANITY_MESSAGE)).toBe('profanity');
  });

  it('[전화번호] 토큰이 있으면 mask', () => {
    expect(getFilterAction(true, '연락처 [전화번호]')).toBe('mask');
  });

  it('필터됐지만 토큰·욕설 문구 없으면 block', () => {
    expect(getFilterAction(true, '민감한 개인정보가 감지되었습니다.')).toBe(
      'block'
    );
  });
});

describe('resolveFilterDisplayAction', () => {
  it('filterAction allow → allow', () => {
    expect(
      resolveFilterDisplayAction({
        isFiltered: false,
        content: '안녕',
        filterAction: 'allow',
        filterReasonCodes: [],
      })
    ).toBe('allow');
  });

  it('filterAction mask → mask', () => {
    expect(
      resolveFilterDisplayAction({
        isFiltered: true,
        content: '연락처 [전화번호]',
        filterAction: 'mask',
        filterReasonCodes: ['PERSONAL_INFO_PHONE'],
      })
    ).toBe('mask');
  });

  it('filterAction block + PROFANITY → profanity', () => {
    expect(
      resolveFilterDisplayAction({
        isFiltered: true,
        content: '다른 문구여도',
        filterAction: 'block',
        filterReasonCodes: ['PROFANITY'],
      })
    ).toBe('profanity');
  });

  it('filterAction block + 개인정보만 → block', () => {
    expect(
      resolveFilterDisplayAction({
        isFiltered: true,
        content: '안내',
        filterAction: 'block',
        filterReasonCodes: ['PERSONAL_INFO_PHONE'],
      })
    ).toBe('block');
  });

  it('BE 필드가 content 문구와 달라도 filterAction을 우선한다', () => {
    expect(
      resolveFilterDisplayAction({
        isFiltered: true,
        content: PROFANITY_MESSAGE,
        filterAction: 'mask',
        filterReasonCodes: ['PERSONAL_INFO_ACCOUNT'],
      })
    ).toBe('mask');
  });

  it('filterAction 없으면 content fallback', () => {
    expect(
      resolveFilterDisplayAction({
        isFiltered: true,
        content: PROFANITY_MESSAGE,
      })
    ).toBe('profanity');
  });
});

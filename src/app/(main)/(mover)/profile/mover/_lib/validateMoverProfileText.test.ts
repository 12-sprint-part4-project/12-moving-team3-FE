import { describe, expect, it } from 'vitest';

import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  getMoverProfileTextFieldState,
  SHORT_DESCRIPTION_MAX,
} from './validateMoverProfileText';

describe('getMoverProfileTextFieldState', () => {
  it('유효한 입력이면 제출 가능 상태가 된다', () => {
    const state = getMoverProfileTextFieldState({
      career: '5',
      shortIntro: '한줄소개',
      description: '상세 설명을 여덟 자 이상.',
    });

    expect(state.isCareerValid).toBe(true);
    expect(state.isShortIntroValid).toBe(true);
    expect(state.isDescriptionValid).toBe(true);
    expect(state.isCareerFormatError).toBe(false);
    expect(state.isShortIntroFormatError).toBe(false);
    expect(state.isDescriptionFormatError).toBe(false);
  });

  it('경력이 비어 있으면 아직 형식 오류가 아니다', () => {
    const state = getMoverProfileTextFieldState({
      career: '',
      shortIntro: '',
      description: '',
    });

    expect(state.careerValue).toBeNull();
    expect(state.isCareerValid).toBe(false);
    expect(state.isCareerFormatError).toBe(false);
  });

  it('경력이 50을 넘으면 형식 오류이다', () => {
    const state = getMoverProfileTextFieldState({
      career: '51',
      shortIntro: '소개',
      description: '상세 설명을 여덟 자 이상.',
    });

    expect(state.isCareerFormatError).toBe(true);
  });

  it('한 줄 소개가 최대 길이를 넘으면 형식 오류이다', () => {
    const state = getMoverProfileTextFieldState({
      career: '1',
      shortIntro: '가'.repeat(SHORT_DESCRIPTION_MAX + 1),
      description: '상세 설명을 여덟 자 이상.',
    });

    expect(state.isShortIntroFormatError).toBe(true);
    expect(state.isShortIntroValid).toBe(false);
  });

  it('상세 설명이 최소 길이 미만이면 형식 오류이다', () => {
    const state = getMoverProfileTextFieldState({
      career: '1',
      shortIntro: '소개',
      description: '가'.repeat(DESCRIPTION_MIN - 1),
    });

    expect(state.isDescriptionFormatError).toBe(true);
    expect(state.isDescriptionValid).toBe(false);
  });

  it('상세 설명이 최대 길이를 넘으면 형식 오류이다', () => {
    const state = getMoverProfileTextFieldState({
      career: '1',
      shortIntro: '소개',
      description: '가'.repeat(DESCRIPTION_MAX + 1),
    });

    expect(state.isDescriptionFormatError).toBe(true);
  });
});

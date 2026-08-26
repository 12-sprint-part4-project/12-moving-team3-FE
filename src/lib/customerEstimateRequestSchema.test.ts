import { describe, expect, it } from 'vitest';

import {
  isEstimateRequestReadyToSubmit,
  reviseEstimateRequestFieldBodySchema,
  saveEstimateRequestStepBodySchema,
  toVisualStep,
} from './customerEstimateRequestSchema';

const readyDetail = {
  moveType: 'HOME',
  moveDate: '2026-09-01',
  departureZipCode: '12345',
  departureAddress: '서울시 강남구',
  departureDetailAddress: '101동 202호',
  arrivalZipCode: '54321',
  arrivalAddress: '서울시 마포구',
  arrivalDetailAddress: '303동 404호',
};

describe('isEstimateRequestReadyToSubmit', () => {
  it('8개 필수 필드가 모두 채워지면 true를 반환한다', () => {
    expect(isEstimateRequestReadyToSubmit(readyDetail)).toBe(true);
  });

  it.each(Object.keys(readyDetail) as (keyof typeof readyDetail)[])(
    '%s가 null이면 false를 반환한다',
    (field) => {
      expect(
        isEstimateRequestReadyToSubmit({ ...readyDetail, [field]: null })
      ).toBe(false);
    }
  );
});

describe('toVisualStep', () => {
  it.each(['SUBMITTED', 'CONFIRMED', 'COMPLETED', 'EXPIRED', 'CANCELED'])(
    'status가 %s(non-DRAFT)이면 4를 반환한다',
    (status) => {
      expect(toVisualStep(status, 1)).toBe(4);
    }
  );

  it.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 3],
    [-1, 1],
  ])('DRAFT + currentStep %i는 %i로 클램프된다', (currentStep, expected) => {
    expect(toVisualStep('DRAFT', currentStep)).toBe(expected);
  });
});

describe('saveEstimateRequestStepBodySchema', () => {
  it('step 1 + 유효한 moveType은 성공한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 1,
      data: { moveType: 'HOME' },
    });
    expect(result.success).toBe(true);
  });

  it('step 1 + 잘못된 moveType은 실패한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 1,
      data: { moveType: 'INVALID' },
    });
    expect(result.success).toBe(false);
  });

  it('step 2 + 유효한 ISO 날짜는 성공한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 2,
      data: { moveDate: '2026-09-01' },
    });
    expect(result.success).toBe(true);
  });

  it('step 2 + 형식이 잘못된 날짜는 실패한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 2,
      data: { moveDate: '2026/09/01' },
    });
    expect(result.success).toBe(false);
  });

  it('step 3 + 주소 8필드 모두 채워지면 성공한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 3,
      data: {
        departureZipCode: '12345',
        departureAddress: '서울시 강남구',
        departureDetailAddress: '101동',
        arrivalZipCode: '54321',
        arrivalAddress: '서울시 마포구',
        arrivalDetailAddress: '303동',
      },
    });
    expect(result.success).toBe(true);
  });

  it('step 3 + 필드 누락 시 실패한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 3,
      data: {
        departureZipCode: '12345',
        departureAddress: '서울시 강남구',
        departureDetailAddress: '101동',
        arrivalZipCode: '54321',
        arrivalAddress: '서울시 마포구',
        // arrivalDetailAddress 누락
      },
    });
    expect(result.success).toBe(false);
  });

  it('step 3 + 공백 문자열 주소는 실패한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 3,
      data: {
        departureZipCode: '12345',
        departureAddress: '   ',
        departureDetailAddress: '101동',
        arrivalZipCode: '54321',
        arrivalAddress: '서울시 마포구',
        arrivalDetailAddress: '303동',
      },
    });
    expect(result.success).toBe(false);
  });

  it('존재하지 않는 step 번호는 실패한다', () => {
    const result = saveEstimateRequestStepBodySchema.safeParse({
      step: 4,
      data: {},
    });
    expect(result.success).toBe(false);
  });
});

describe('reviseEstimateRequestFieldBodySchema', () => {
  it.each([
    ['moveType', 'HOME'],
    ['moveDate', '2026-09-01'],
    ['departureZipCode', '12345'],
    ['departureAddress', '서울시 강남구'],
    ['departureDetailAddress', '101동'],
    ['arrivalZipCode', '54321'],
    ['arrivalAddress', '서울시 마포구'],
    ['arrivalDetailAddress', '303동'],
  ])('field %s + 유효한 value는 성공한다', (field, value) => {
    const result = reviseEstimateRequestFieldBodySchema.safeParse({
      field,
      value,
    });
    expect(result.success).toBe(true);
  });

  it('존재하지 않는 field는 실패한다', () => {
    const result = reviseEstimateRequestFieldBodySchema.safeParse({
      field: 'invalidField',
      value: 'HOME',
    });
    expect(result.success).toBe(false);
  });

  it('field-value 타입이 불일치하면 실패한다', () => {
    const result = reviseEstimateRequestFieldBodySchema.safeParse({
      field: 'moveType',
      value: '잘못된값',
    });
    expect(result.success).toBe(false);
  });
});

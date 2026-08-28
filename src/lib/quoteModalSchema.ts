import { z } from 'zod';

/** 견적가 최대값 (10억) */
export const MAX_QUOTE_PRICE = 1_000_000_000;
/** 코멘트·반려 사유 최소 글자 수 */
export const MIN_QUOTE_TEXT_LENGTH = 10;
/** 코멘트·반려 사유 최대 글자 수 */
export const MAX_QUOTE_TEXT_LENGTH = 500;

const MAX_QUOTE_PRICE_LABEL = MAX_QUOTE_PRICE.toLocaleString('ko-KR');

/** 견적가 입력값 — 숫자만, 1 이상 MAX 이하 */
export const quotePriceSchema = z
  .string()
  .regex(/^\d+$/, '숫자만 입력할 수 있습니다.')
  .superRefine((value, ctx) => {
    try {
      const price = BigInt(value);

      if (price < BigInt(1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '견적가는 1원 이상이어야 합니다.',
        });
        return;
      }

      if (price > BigInt(MAX_QUOTE_PRICE)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `견적가는 최대 ${MAX_QUOTE_PRICE_LABEL}원까지 입력할 수 있습니다.`,
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '숫자만 입력할 수 있습니다.',
      });
    }
  });

/** 코멘트·반려 사유 — 10자 이상 500자 이하 */
export const quoteTextSchema = z
  .string()
  .trim()
  .min(
    MIN_QUOTE_TEXT_LENGTH,
    `최소 ${MIN_QUOTE_TEXT_LENGTH}자 이상 입력해 주세요.`
  )
  .max(
    MAX_QUOTE_TEXT_LENGTH,
    `최대 ${MAX_QUOTE_TEXT_LENGTH}자까지 입력할 수 있습니다.`
  );

/** 견적 보내기 폼 검증 */
export const sendQuoteFormSchema = z.object({
  price: quotePriceSchema,
  comment: quoteTextSchema,
});

/** 반려 요청 폼 검증 */
export const rejectRequestFormSchema = z.object({
  reason: quoteTextSchema,
});

/**
 * 코멘트·반려 사유 입력 정규화.
 * 맨 앞 공백(스페이스·탭·개행)은 허용하지 않는다.
 */
export const normalizeQuoteTextInput = (raw: string): string =>
  raw.trimStart().slice(0, MAX_QUOTE_TEXT_LENGTH);

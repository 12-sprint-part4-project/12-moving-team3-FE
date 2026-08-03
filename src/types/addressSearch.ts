import { z } from 'zod';

/**
 * 주소 검색 결과 1건 — SelectAddressModal AddressOption 과 동일 shape.
 * @see https://business.juso.go.kr/jst/jstRoadNmAddrApiSearch
 */
export const addressSearchItemSchema = z.object({
  id: z.string().min(1),
  zipCode: z.string().min(1),
  roadAddress: z.string().min(1),
  lotAddress: z.string(),
});

export type AddressSearchItem = z.infer<typeof addressSearchItemSchema>;

/** GET /api/addresses 성공 data */
export const addressSearchResultSchema = z.object({
  addresses: z.array(addressSearchItemSchema),
  totalCount: z.number().int().nonnegative(),
  currentPage: z.number().int().positive(),
  /** true면 JUSO_API_KEY 미설정으로 fixture mock 응답 */
  isMock: z.boolean(),
});

export type AddressSearchResult = z.infer<typeof addressSearchResultSchema>;

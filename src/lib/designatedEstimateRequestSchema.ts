import { z } from 'zod';

/** POST /api/designated-estimate-requests body */
export const createDesignatedEstimateBodySchema = z.object({
  estimateRequestId: z.number().int().positive(),
  moverId: z.uuid(),
});

export type CreateDesignatedEstimateBody = z.infer<
  typeof createDesignatedEstimateBodySchema
>;

/** POST 성공 data */
export const designatedEstimateMoverSchema = z.object({
  id: z.number(),
  estimateId: z.number(),
  moverId: z.uuid(),
});

export type DesignatedEstimateMover = z.infer<
  typeof designatedEstimateMoverSchema
>;

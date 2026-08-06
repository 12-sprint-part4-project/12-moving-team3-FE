import { isFurnitureSharePost } from '@/constants/communityOptions';

export type FurnitureShareDetailAction = 'chat' | 'complete' | 'completed-status';

export { isFurnitureSharePost };

export const resolveFurnitureShareCompleted = (
  isCompleted: boolean | null | undefined,
  isLocallyMarkedComplete: boolean
): boolean => isCompleted === true || isLocallyMarkedComplete;

export const resolveFurnitureShareDetailAction = (
  isFurnitureShare: boolean,
  isPostOwner: boolean,
  isCompleted: boolean
): FurnitureShareDetailAction | null => {
  if (!isFurnitureShare) {
    return null;
  }

  if (isCompleted) {
    return 'completed-status';
  }

  if (isPostOwner) {
    return 'complete';
  }

  return 'chat';
};

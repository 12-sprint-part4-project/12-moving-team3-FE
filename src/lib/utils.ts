import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 디자인 토큰 text-{size}-{weight}는 기본 twMerge에서 text-white 등과
 * 같은 그룹으로 충돌 처리된다. font-size 그룹으로 등록해 색상과 공존시킨다.
 */
const TYPOGRAPHY_SIZES = [
  '3xl-bold',
  '3xl-semibold',
  '2xl-bold',
  '2xl-semibold',
  '2xl-medium',
  '2xl-regular',
  'xl-bold',
  'xl-semibold',
  'xl-medium',
  'xl-regular',
  '2lg-bold',
  '2lg-semibold',
  '2lg-medium',
  '2lg-regular',
  'lg-bold',
  'lg-semibold',
  'lg-medium',
  'lg-regular',
  'md-bold',
  'md-semibold',
  'md-medium',
  'md-regular',
  'sm-semibold',
  'sm-medium',
  'xs-semibold',
  'xs-medium',
  'xs-regular',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TYPOGRAPHY_SIZES] }],
    },
  },
});

// clsx로 조건부 클래스를 합친 뒤, tailwind-merge로 중복/충돌되는 Tailwind 클래스를 정리한다.
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

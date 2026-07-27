import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx로 조건부 클래스를 합친 뒤, tailwind-merge로 중복/충돌되는 Tailwind 클래스를 정리한다.
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

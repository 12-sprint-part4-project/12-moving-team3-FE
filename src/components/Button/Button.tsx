import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * ⚠️ TEMPORARY EXAMPLE COMPONENT
 *
 * Storybook + Chromatic 세팅 검증 및 cva(class-variance-authority) + cn 사용법을
 * 팀에 공유하기 위한 예시 컴포넌트입니다.
 * Figma 디자인 기준의 실제 공통 Button 컴포넌트가 만들어지면 이 파일과
 * Button.stories.tsx는 삭제해도 됩니다.
 *
 * (색상은 src/app/globals.css 의 @theme 토큰을 사용합니다.
 *  Tailwind 기본 색상(bg-blue-500 등)은 이 프로젝트에 정의되어 있지 않아 적용되지 않습니다.)
 *
 * --- cva 사용법 ---
 * 1. cva(공통 클래스, { variants, defaultVariants })로 variant/size 등 옵션별
 *    클래스 조합을 한 곳에 선언한다. (기존처럼 `variant === 'primary' ? ... : ...`
 *    삼항연산자를 겹겹이 쓰지 않아도 된다.)
 * 2. VariantProps<typeof buttonVariants>로 위에서 정의한 variant/size의 타입을
 *    자동으로 뽑아 Props에 합쳐 쓴다. (직접 유니온 타입을 또 적을 필요가 없다.)
 * 3. 컴포넌트 내부에서 buttonVariants({ variant, size })를 호출해 클래스 문자열을
 *    만들고, 외부에서 내려주는 className과 충돌/중복될 수 있으니 cn()으로 합친다.
 */
const buttonVariants = cva('rounded-lg font-semibold transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-300 text-white hover:bg-blue-200 disabled:bg-gray-200',
      secondary:
        'border border-blue-300 bg-white text-blue-300 hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-300',
    },
    size: {
      small: 'px-4 py-2 text-md-semibold',
      large: 'px-6 py-3 text-lg-semibold',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'large',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = ({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

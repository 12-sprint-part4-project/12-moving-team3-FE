/**
 * ⚠️ TEMPORARY EXAMPLE COMPONENT
 *
 * Storybook + Chromatic 세팅 검증 및 팀 첫 예시용으로 작성된 임시 컴포넌트입니다.
 * Figma 디자인 기준의 실제 공통 Button 컴포넌트가 만들어지면 이 파일과
 * Button.stories.tsx는 삭제해도 됩니다.
 *
 * (색상은 src/app/globals.css 의 @theme 토큰을 사용합니다.
 *  Tailwind 기본 색상(bg-blue-500 등)은 이 프로젝트에 정의되어 있지 않아 적용되지 않습니다.)
 */
type ButtonProps = {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'large';
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  };
  
  export const Button = ({
    variant = 'primary',
    size = 'large',
    disabled = false,
    children,
    onClick,
  }: ButtonProps) => {
    const baseStyle = 'rounded-lg font-semibold transition-colors';
  
    const variantStyle =
      variant === 'primary'
        ? 'bg-blue-300 text-white hover:bg-blue-200 disabled:bg-gray-200'
        : 'bg-white text-blue-300 border border-blue-300 hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-300';
  
    const sizeStyle = size === 'large' ? 'px-6 py-3 text-lg-semibold' : 'px-4 py-2 text-md-semibold';
  
    return (
      <button
        type="button"
        className={`${baseStyle} ${variantStyle} ${sizeStyle}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
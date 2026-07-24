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

  const sizeStyle =
    size === 'large'
      ? 'px-6 py-3 text-lg-semibold'
      : 'px-4 py-2 text-md-semibold';

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

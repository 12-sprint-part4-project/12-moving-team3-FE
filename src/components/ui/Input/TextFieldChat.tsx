import type { HTMLAttributes, ReactNode } from 'react';

/*
  TEXT FIELD CHAT 컴포넌트
  
  [props]
  - color: 'incoming' | 'mePrimary' | 'meSecondary'
  - size: 'sm' | 'md'
  - children: ReactNode
  - className: string
  - ...rest: HTMLAttributes<HTMLDivElement>
*/

type ChatColor = 'incoming' | 'mePrimary' | 'meSecondary';
type ChatSize = 'sm' | 'md';

interface TextFieldChatProps extends HTMLAttributes<HTMLDivElement> {
  color?: ChatColor;
  size?: ChatSize;
  children: ReactNode;
}

const colorStyles: Record<ChatColor, string> = {
  incoming: 'bg-white text-black-400',
  mePrimary: 'bg-blue-300 text-white',
  meSecondary: 'bg-blue-100 text-blue-300',
};

const sizeStyles: Record<ChatSize, Record<ChatColor, string>> = {
  sm: {
    incoming: 'px-5 py-3 text-md-medium',
    mePrimary: 'px-5 py-3 text-md-medium',
    meSecondary: 'px-5 py-3 text-md-semibold',
  },
  md: {
    incoming: 'px-10 py-5 text-2lg-medium',
    mePrimary: 'px-10 py-5 text-2lg-medium',
    meSecondary: 'px-10 py-5 text-2lg-semibold',
  },
};

const radiusStyles: Record<ChatColor, Record<ChatSize, string>> = {
  incoming: {
    sm: 'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl',
    md: 'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl',
  },
  mePrimary: {
    sm: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
    md: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
  },
  meSecondary: {
    sm: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
    md: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
  },
};

export const TextFieldChat = ({
  color = 'incoming',
  size = 'sm',
  children,
  className = '',
  ...rest
}: TextFieldChatProps) => {
  return (
    <div
      {...rest}
      className={`inline-flex max-w-full drop-shadow-sm ${colorStyles[color]} ${sizeStyles[size][color]} ${radiusStyles[color][size]} ${className}`.trim()}
    >
      <p className="break-words whitespace-pre-wrap">{children}</p>
    </div>
  );
};

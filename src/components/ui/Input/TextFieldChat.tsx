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
    incoming: 'px-[1.25rem] py-[0.75rem] text-md-medium',
    mePrimary: 'px-[1.25rem] py-[0.75rem] text-md-medium',
    meSecondary: 'px-[1.25rem] py-[0.75rem] text-md-semibold',
  },
  md: {
    incoming: 'px-[2.5rem] py-[1.25rem] text-2lg-medium',
    mePrimary: 'px-[2.5rem] py-[1.25rem] text-2lg-medium',
    meSecondary: 'px-[2.5rem] py-[1.25rem] text-2lg-semibold',
  },
};

const radiusStyles: Record<ChatColor, Record<ChatSize, string>> = {
  incoming: {
    sm: 'rounded-tr-[1.5rem] rounded-br-[1.5rem] rounded-bl-[1.5rem]',
    md: 'rounded-tr-[1.875rem] rounded-br-[1.875rem] rounded-bl-[1.875rem]',
  },
  mePrimary: {
    sm: 'rounded-tl-[1.5rem] rounded-br-[1.5rem] rounded-bl-[1.5rem]',
    md: 'rounded-tl-[1.875rem] rounded-br-[1.875rem] rounded-bl-[1.875rem]',
  },
  meSecondary: {
    sm: 'rounded-tl-[1.5rem] rounded-br-[1.5rem] rounded-bl-[1.5rem]',
    md: 'rounded-tl-[1.875rem] rounded-br-[1.875rem] rounded-bl-[1.875rem]',
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
      className={`inline-flex max-w-full drop-shadow-[2px_2px_4px_rgba(224,224,224,0.2)] ${colorStyles[color]} ${sizeStyles[size][color]} ${radiusStyles[color][size]} ${className}`.trim()}
    >
      <p className="break-words whitespace-pre-wrap">{children}</p>
    </div>
  );
};

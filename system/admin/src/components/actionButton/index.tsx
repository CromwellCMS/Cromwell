import React from 'react';

type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
  bold?: boolean;
  uppercase?: boolean;
};

export const ActionButton = ({ className = '', type = 'button', children, bold, uppercase, ...rest }: ButtonProps) => {
  return (
    <button
      type={type as 'button' | 'submit' | 'reset'}
      className={`rounded-lg ${bold ? 'font-bold' : ''} bg-indigo-600 my-2 text-sm text-white py-1 px-4 ${
        uppercase ? 'uppercase' : ''
      } self-center float-right hover:bg-indigo-500 disabled:bg-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

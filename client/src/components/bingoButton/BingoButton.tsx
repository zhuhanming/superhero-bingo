import React from 'react';

type Props = {
  text: string;
  onClick: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
  hasHover?: boolean;
  className?: string;

  // All other props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
};

const BingoButton: React.FC<Props> = ({
  text,
  onClick,
  isDisabled,
  isLoading = false,
  hasHover = true,
  className = '',
  ...props
}) => {
  const buttonClassName = hasHover
    ? `w-full font-bold rounded-xl border-black transform transition duration-500 shadow-lg ${
        isDisabled || isLoading
          ? 'cursor-not-allowed opacity-60'
          : 'hover:scale-105'
      } ${className}`
    : `w-full font-bold rounded-xl border-black shadow-lg ${
        isDisabled || isLoading ? 'cursor-not-allowed opacity-60' : ''
      } ${className}`;

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? 'Loading...' : text}
    </button>
  );
};

export default BingoButton;

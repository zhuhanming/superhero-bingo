import React from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isDisabled?: boolean;
  className?: string;
};

const BingoInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  isDisabled = false,
  className = '',
}) => {
  return (
    <input
      className={`w-full rounded-xl font-medium outline-none ${
        isDisabled ? 'bg-gray' : ''
      } ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(event) => {
        const value = event.target.value
          .replace(/ +/g, ' ')
          .replace(/[\r\n\v]+/g, '');
        onChange(value);
      }}
      disabled={isDisabled}
    />
  );
};

export default BingoInput;

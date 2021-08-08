import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrashIcon: React.FC<any> = (props: any) => {
  const { className, ...otherProps } = props;
  return (
    <i
      {...otherProps}
      className={`fas fa-trash ${className != null ? className : ''}`}
    />
  );
};

export default TrashIcon;

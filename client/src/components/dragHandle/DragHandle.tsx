import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DragHandle: React.FC<any> = (props: any) => {
  const { className, ...otherProps } = props;
  return (
    <i
      {...otherProps}
      className={`fas fa-bars ${className != null ? className : ''}`}
    />
  );
};

export default DragHandle;

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
};

const SoundButton: React.FC<Props> = ({
  isPlaying,
  onClick,
  className = '',
}) => {
  return (
    <i
      className={`fas ${
        isPlaying ? 'fa-volume-up' : 'fa-volume-mute'
      } ${className}`}
      onClick={onClick}
      role="button"
    />
  );
};

export default SoundButton;

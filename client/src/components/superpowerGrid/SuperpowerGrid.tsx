import React from 'react';

import { DuxSuperpower } from 'reducers/bingoDux';
import { sortByOrder } from 'utils/sortUtils';

import './SuperpowerGrid.css';

type Props = {
  superpowers: DuxSuperpower[];
};

const getNumPowersPerSide = (superpowers: DuxSuperpower[]): number => {
  const { length } = superpowers;
  return Math.ceil(Math.sqrt(length));
};

const SuperpowerGrid: React.FC<Props> = ({ superpowers }) => {
  const gridSize = getNumPowersPerSide(superpowers);
  const superpowersToRender = superpowers.slice().sort(sortByOrder);

  const getFontSize = (): string => {
    if (gridSize < 3) {
      return 'text-lg';
    }
    if (gridSize === 3) {
      return 'text-md';
    }
    if (gridSize === 4) {
      return 'text-sm';
    }
    return 'text-xs';
  };

  return (
    <div className="flex items-center w-full h-full pl-20">
      <div
        className={`w-full grid grid-cols-${gridSize} border-black border-t-8 border-l-8`}
      >
        {superpowersToRender.map((s) => (
          <div
            className={`bg-red border-black border-b-8 border-r-8 superpower-grid-cell flex justify-center items-center p-2 text-center break-all ${getFontSize()}`}
            key={s.uniqueId}
          >
            {s.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperpowerGrid;

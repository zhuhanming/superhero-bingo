import React, { useEffect } from 'react';
import autosize from 'autosize';

import { MAX_DESCRIPTION_LENGTH } from 'constants/bingo';
import { DuxSuperpower } from 'reducers/bingoDux';
import { sortByOrder } from 'utils/sortUtils';

import './SuperpowerGrid.css';

type Props = {
  superpowers: DuxSuperpower[];
  isEdit?: boolean;
  onChangeGridCell?: (index: number, description: string) => void;
};

const getNumPowersPerSide = (superpowers: DuxSuperpower[]): number => {
  const { length } = superpowers;
  return Math.ceil(Math.sqrt(length));
};

const SuperpowerGrid: React.FC<Props> = ({
  superpowers,
  isEdit = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeGridCell = (_a, _b) => undefined,
}) => {
  const gridSize = getNumPowersPerSide(superpowers);
  const superpowersToRender = superpowers.slice().sort(sortByOrder);

  useEffect(() => {
    autosize(document.querySelectorAll('textarea'));
  });

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
    <div className="flex items-center justify-center w-full h-full pl-20">
      {superpowersToRender.length === 0 && (
        <h1 className="font-bold text-xl mb-4">
          Add a superpower to get started!
        </h1>
      )}
      {superpowersToRender.length > 0 && (
        <div
          className={`w-full grid grid-cols-${gridSize} border-black border-t-8 border-l-8`}
        >
          {superpowersToRender.map((s, index) => (
            <div
              className={`bg-red border-black border-b-8 border-r-8 superpower-grid-cell flex justify-center items-center p-2 text-center break-words ${getFontSize()}`}
              key={s.uniqueId}
            >
              {isEdit ? (
                <textarea
                  className="text-center flex bg-red outline-none font-medium"
                  value={s.description}
                  rows={1}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`superpower-description-${s.uniqueId}`}
                  onChange={(event) => {
                    const value = event.target.value
                      .replace(/ +/g, ' ')
                      .replace(/[\r\n\v]+/g, '');
                    onChangeGridCell(index, value);
                    autosize(document.querySelectorAll('textarea'));
                  }}
                  onKeyPress={(event) => {
                    if (
                      event.key === 'Enter' ||
                      s.description.length >= MAX_DESCRIPTION_LENGTH
                    ) {
                      event.preventDefault();
                    }
                  }}
                />
              ) : (
                s.description
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperpowerGrid;

/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import autosize from 'autosize';
import { Invite, Superhero } from 'shared';

import { MAX_DESCRIPTION_LENGTH } from 'constants/text';
import { DuxSuperpower } from 'reducers/bingoDux';
import { sortByOrder } from 'utils/sortUtils';

import './SuperpowerGrid.css';

type Props = {
  superpowers: DuxSuperpower[];
  isEdit?: boolean;
  onChangeGridCell?: (index: number, description: string) => void;
  className?: string;
  invites?: Invite[];
  superheroes?: Superhero[];
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
  className = '',
  invites = [],
  superheroes = [],
}) => {
  const gridSize = getNumPowersPerSide(superpowers);
  const superpowersToRender = superpowers.slice().sort(sortByOrder);
  const [clicked, setClicked] = useState<{ [id: number]: boolean }>({});

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

  const onClickInviteCode = (id: number, inviteCode: string): void => {
    const newClicked = { ...clicked, [id]: true };
    setClicked(newClicked);
    navigator.clipboard.writeText(inviteCode);
    setTimeout(() => {
      const newClicked = { ...clicked, [id]: false };
      setClicked(newClicked);
    }, 1000);
  };

  return (
    <div
      className={`flex items-center justify-center w-full h-full ${className}`}
    >
      {superpowersToRender.length === 0 && (
        <h1 className="font-bold text-xl mb-4">
          Add a superpower to get started!
        </h1>
      )}
      {superpowersToRender.length > 0 && (
        <div
          className={`w-full grid grid-cols-${gridSize} border-black border-t-8 border-l-8`}
        >
          {superpowersToRender.map((s, index) => {
            if (isEdit) {
              return (
                <div
                  className={`bg-red border-black border-b-8 border-r-8 superpower-grid-cell flex justify-center items-center p-2 text-center break-words ${getFontSize()}`}
                  key={s.uniqueId}
                >
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
                </div>
              );
            }
            const invite = invites.find((i) => i.superpowerId === s.id!)!;
            return (
              <div
                className={`${
                  invite.signeeId != null ? 'bg-green' : 'bg-red'
                } border-black border-b-8 border-r-8 superpower-grid-cell flex justify-center items-center p-2 text-center break-words ${getFontSize()}`}
                key={s.uniqueId}
              >
                <div
                  className="has-tooltip cursor-pointer font-medium flex justify-center"
                  onClick={() => onClickInviteCode(s.id!, invite.inviteCode)}
                  onKeyDown={() => onClickInviteCode(s.id!, invite.inviteCode)}
                >
                  <span className="tooltip rounded shadow-lg py-1 px-2 bg-black text-white -mt-6 text-sm">
                    {clicked[s.id!] === true ? 'Copied!' : invite.inviteCode}
                  </span>
                  {s.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SuperpowerGrid;

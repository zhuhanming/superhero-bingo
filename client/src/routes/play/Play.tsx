/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Leaderboard from 'components/leaderboard';
import SuperpowerGrid from 'components/superpowerGrid';
import { RootState } from 'reducers/rootReducer';

enum PlayTab {
  LEADERBOARD,
  SIGN,
}

const Play: React.FC = () => {
  const bingo = useSelector((state: RootState) => state.bingo.bingo);
  const [tab, setTab] = useState(PlayTab.LEADERBOARD);
  const { game, leaderboard, invitations } = useSelector(
    (state: RootState) => state.game
  );

  return (
    <main className="flex pt-8" style={{ height: 'calc(100vh - 3rem)' }}>
      <div className="hidden md:block mr-8" style={{ flex: 3 }}>
        <SuperpowerGrid
          superpowers={bingo.superpowers}
          isEdit={false}
          className="pr-20"
          invites={invitations}
        />
      </div>
      <div className="flex flex-col" style={{ flex: 2 }}>
        <div className="flex">
          <h1
            className={`font-bold text-2xl mb-4 cursor-pointer ${
              tab === PlayTab.LEADERBOARD ? 'text-black' : 'text-gray'
            }`}
            onClick={() => setTab(PlayTab.LEADERBOARD)}
            onKeyDown={() => setTab(PlayTab.LEADERBOARD)}
          >
            Leaderboard
          </h1>
          <h1
            className={`font-bold text-2xl mb-4 ml-8 cursor-pointer ${
              tab === PlayTab.SIGN ? 'text-black' : 'text-gray'
            }`}
            onClick={() => setTab(PlayTab.SIGN)}
            onKeyDown={() => setTab(PlayTab.SIGN)}
          >
            Sign
          </h1>
        </div>
        {tab === PlayTab.LEADERBOARD ? (
          <Leaderboard
            superheroes={game.heroes}
            leaderboard={leaderboard}
            numSuperpowers={bingo.superpowers.length}
            className="flex-1 overflow-scroll"
          />
        ) : null}
      </div>
    </main>
  );
};

export default Play;

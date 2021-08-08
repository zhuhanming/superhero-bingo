import React from 'react';
import { useSelector } from 'react-redux';

import BingoInput from 'components/bingoInput';
import Navbar from 'components/navbar';
import { SITE_URL } from 'constants/urls';
import { RootState } from 'reducers/rootReducer';

const Game: React.FC = () => {
  const game = useSelector((state: RootState) => state.game.game);
  return (
    <div>
      <Navbar />
      <main
        className="flex flex-col items-center"
        style={{ minHeight: 'calc(100vh - 6rem)' }}
      >
        <h1 className="font-bold text-3xl mt-8 mb-2 text-center">
          Join at {SITE_URL}
        </h1>
        <BingoInput
          className="md:max-w-2xl p-4 text-2xl text-center mb-8"
          placeholder="A1B24C6"
          value={
            game.joinCode.length > 0 ? game.joinCode : 'Loading Room Code...'
          }
          isDisabled
          onChange={() => undefined}
        />
        <h1 className="font-bold text-3xl mt-8 mb-2">Superheroes</h1>
        <div className="flex flex-row-reverse">
          {game.heroes.length === 0 && 'Waiting for heroes to join!'}
          {game.heroes.map((hero) => (
            <div
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              key={`hero-${hero.id}`}
            >
              {hero.name}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Game;

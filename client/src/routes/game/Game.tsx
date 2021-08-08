import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Navbar from 'components/navbar';
import { SITE_URL } from 'constants/urls';
import { useSocket } from 'contexts/SocketContext';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { fetchGame, startGame } from 'services/gameService';

import OngoingGame from './OngoingGame';

const Game: React.FC = () => {
  const game = useSelector((state: RootState) => state.game.game);
  const isStartingGame = useSelector(
    (state: RootState) => state.misc.loading.isStartingGame
  );
  const { superpowers, ownerCode } = useSelector(
    (state: RootState) => state.bingo.bingo
  );
  const dispatch = useDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (game.id !== -1) {
      fetchGame(socket, game.id);
    }
  }, []);

  const onStartGame = () => {
    dispatch(updateLoadingState({ isStartingGame: true }));
    startGame(socket, game.id, ownerCode);
  };

  if (game.hasEnded) {
    return <>Results Page</>;
  }

  if (game.hasStarted) {
    return <OngoingGame />;
  }

  return (
    <>
      <Navbar />
      <main
        className="flex flex-col items-center"
        style={{ height: 'calc(100vh - 6rem)' }}
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
        <h1 className="font-bold text-3xl mt-8 mb-2">
          Superheroes ({game.heroes.length})
        </h1>
        <div className="flex flex-1 flex-row-reverse flex-wrap w-full justify-center overflow-scroll">
          {game.heroes.length === 0 && 'Waiting for heroes to join!'}
          {game.heroes.map((hero) => (
            <div
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 font-bold text-center text-2xl p-4 text-red mb-2"
              key={`hero-${hero.id}`}
            >
              {hero.name}
            </div>
          ))}
        </div>
        <BingoButton
          text="Start Game!"
          isDisabled={game.heroes.length < superpowers.length}
          isLoading={isStartingGame}
          onClick={onStartGame}
          className="md:max-w-2xl p-4 bg-blue border-black border-8 mt-4"
        />
      </main>
    </>
  );
};

export default Game;

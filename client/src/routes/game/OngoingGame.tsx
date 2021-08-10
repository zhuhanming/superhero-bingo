import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BingoButton from 'components/bingoButton';
import Leaderboard from 'components/leaderboard';
import { useSocket } from 'contexts/SocketContext';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { endGame } from 'services/gameService';

const OngoingGame: React.FC = () => {
  const bingo = useSelector((state: RootState) => state.bingo.bingo);
  const { game, leaderboard } = useSelector((state: RootState) => state.game);
  const isEndingGame = useSelector(
    (state: RootState) => state.misc.loading.isEndingGame
  );
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const onClickEndGame = () => {
    dispatch(updateLoadingState({ isEndingGame: true }));
    endGame(socket, game.id, bingo.ownerCode);
  };

  return (
    <main className="flex pt-8" style={{ height: 'calc(100vh - 3rem)' }}>
      <div className="hidden md:block mr-8" style={{ flex: 3 }}>
        <h1 className="font-bold text-2xl mb-4">How to Play</h1>
        <p className="text-xl font-regular mb-4">
          You should see a grid of {bingo.superpowers.length}{' '}
          {bingo.superpowers.length === 1 ? 'superpower ' : 'superpowers'} in
          front of you.
        </p>
        <p className="text-xl font-regular mb-4">
          Your goal is to find{' '}
          <strong>{bingo.superpowers.length} unique</strong>{' '}
          {bingo.superpowers.length === 1 ? 'superhero' : 'superheroes'} to sign
          against the superpowers that they possess.
        </p>
        <p className="text-xl font-regular mb-4">
          To do so, simply click on the square you want to get signed to copy an
          invite code, and send the code to that superhero.
        </p>
        <p className="text-xl font-regular mb-4">
          To sign, simply click the Sign tab on the top right hand corner, paste
          the invite code that you have received from fellow superheroes into
          the field there, and click &quot;Sign&quot;!
        </p>
        <p className="text-xl font-regular mb-4">
          The first superhero to get all superpowers signed wins!
        </p>
      </div>
      <div className="flex flex-col" style={{ flex: 2 }}>
        <h1 className="font-bold text-2xl mb-4">Leaderboard</h1>
        <Leaderboard
          superheroes={game.heroes}
          leaderboard={leaderboard}
          numSuperpowers={bingo.superpowers.length}
          className="flex-1 overflow-scroll"
        />
        <BingoButton
          text="End Game"
          onClick={onClickEndGame}
          className="mtext-lg p-2 bg-red border-black border-4 mt-4"
          isLoading={isEndingGame}
        />
      </div>
    </main>
  );
};

export default OngoingGame;

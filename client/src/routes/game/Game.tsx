import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Sound from 'react-sound';

import backgroundMusic from 'assets/music/bgm.mp3';
import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import SoundButton from 'components/soundButton';
import { ROOT } from 'constants/routes';
import { SITE_URL } from 'constants/urls';
import { useSocket } from 'contexts/SocketContext';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { fetchGameOwnerCode, startGame } from 'services/gameService';
import { fetchResult } from 'services/resultService';

import CompletedGame from './CompletedGame';
import OngoingGame from './OngoingGame';

const Game: React.FC = () => {
  const history = useHistory();
  const game = useSelector((state: RootState) => state.game.game);
  const [isPlaying, setIsPlaying] = useState(true);
  const isStartingGame = useSelector(
    (state: RootState) => state.misc.loading.isStartingGame
  );
  const { superpowers, ownerCode } = useSelector(
    (state: RootState) => state.bingo.bingo
  );
  const dispatch = useDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (ownerCode !== '') {
      fetchGameOwnerCode(socket, ownerCode);
    } else {
      history.push(ROOT);
    }
  }, []);

  useEffect(() => {
    if (game.id !== -1) {
      fetchResult(socket, game.id);
    }
  }, []);

  useEffect(() => {
    dispatch(
      updateLoadingState({ isStartingGame: false, isEndingGame: false })
    );
  }, []);

  const onStartGame = () => {
    dispatch(updateLoadingState({ isStartingGame: true }));
    startGame(socket, game.id, ownerCode);
  };

  if (game.hasEnded) {
    return (
      <>
        <Sound
          url={backgroundMusic}
          playStatus={isPlaying ? 'PLAYING' : 'PAUSED'}
          loop
          volume={10}
        />
        <SoundButton
          isPlaying={isPlaying}
          onClick={() => setIsPlaying((isPlaying) => !isPlaying)}
          className="absolute bottom-10 left-10 text-xl"
        />
        <CompletedGame />
      </>
    );
  }

  if (game.hasStarted) {
    return (
      <>
        <Sound
          url={backgroundMusic}
          playStatus={isPlaying ? 'PLAYING' : 'PAUSED'}
          loop
          volume={10}
        />
        <SoundButton
          isPlaying={isPlaying}
          onClick={() => setIsPlaying((isPlaying) => !isPlaying)}
          className="absolute bottom-10 left-10 text-xl"
        />
        <OngoingGame />
      </>
    );
  }

  return (
    <>
      <Sound
        url={backgroundMusic}
        playStatus={isPlaying ? 'PLAYING' : 'PAUSED'}
        loop
        volume={10}
      />
      <SoundButton
        isPlaying={isPlaying}
        onClick={() => setIsPlaying((isPlaying) => !isPlaying)}
        className="absolute bottom-10 left-10 text-xl"
      />
      <main
        className="flex flex-col items-center"
        style={{ height: 'calc(100vh - 6rem)' }}
      >
        <h1 className="font-bold text-3xl mt-16 mb-2 text-center">
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
        <div className="flex flex-1 flex-wrap w-full justify-center overflow-scroll hide-scrollbar">
          {game.heroes.length === 0 && 'Waiting for heroes to join!'}
          {game.heroes
            .slice()
            .reverse()
            .map((hero) => (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 font-bold text-center text-2xl p-4 text-red mb-2 flex justify-center items-center"
                key={`hero-${hero.id}`}
              >
                {hero.name}
              </div>
            ))}
        </div>
        <BingoButton
          text="Start Game!"
          isDisabled={game.heroes.length < 2}
          isLoading={isStartingGame}
          onClick={onStartGame}
          className="md:max-w-2xl p-4 bg-blue border-black border-8 mt-4"
        />
      </main>
    </>
  );
};

export default Game;

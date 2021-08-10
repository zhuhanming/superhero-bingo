import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MAX_NUM_CHARS_SUPERHERO_NAME, NUM_CHARS_JOIN_CODE } from 'shared';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Navbar from 'components/navbar';
import { PLAY } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { fetchGameUserToken, joinGame, leaveGame } from 'services/gameService';
import { callbackHandler } from 'utils/callbackHandler';

const Join: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState('');
  const history = useHistory();
  const isJoining = useSelector(
    (state: RootState) => state.misc.loading.isJoining
  );
  const { game, self } = useSelector((state: RootState) => state.game);
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (self.token != null) {
      callbackHandler.fetchGameUserTokenCallback = () => {
        if (game.hasStarted) {
          history.push(PLAY);
        }
      };
      fetchGameUserToken(socket, self.token);
    }
  }, [game.hasStarted]);

  useEffect(() => {
    dispatch(updateLoadingState({ isJoining: false }));
  }, []);

  const onLeaveRoom = () => {
    leaveGame(socket, self.token);
  };

  if (game.id !== -1 && !game.hasStarted && !game.hasEnded) {
    return (
      <main
        style={{ minHeight: 'calc(100vh - 6rem)' }}
        className="flex flex-col justify-center items-center text-center"
      >
        <h1 className="font-bold text-3xl mb-12">
          Welcome, {self.name}. Waiting for the game to start...
        </h1>
        <h1 className="font-bold text-2xl mb-16 text-center text-red">
          You should see your name on the screen!
        </h1>
        <BingoButton
          text="Leave Room"
          onClick={onLeaveRoom}
          className="md:max-w-2xl text-lg p-2 bg-red border-black border-4"
        />
      </main>
    );
  }

  const onUpdateCode = (newCode: string) => {
    if (
      newCode.length > NUM_CHARS_JOIN_CODE ||
      (newCode.length > 0 && !newCode.match(/^[0-9a-zA-Z]+$/))
    ) {
      return;
    }
    setJoinCode(newCode.toUpperCase());
  };

  const onUpdateName = (newName: string) => {
    if (newName.length > MAX_NUM_CHARS_SUPERHERO_NAME) {
      return;
    }
    setName(newName);
  };

  const onClickJoin = () => {
    dispatch(updateLoadingState({ isJoining: true }));
    joinGame(socket, joinCode, name);
  };

  return (
    <>
      <Navbar />
      <main
        style={{ minHeight: 'calc(100vh - 6rem)' }}
        className="flex flex-col justify-center items-center text-center"
      >
        <h1 className="font-bold text-3xl mb-12">Join a Game Now!</h1>
        <h1 className="font-bold text-2xl mb-2 text-center">Room Code</h1>
        <BingoInput
          className="md:max-w-2xl p-4 text-2xl text-center mb-8"
          placeholder="A1B24C6"
          value={joinCode}
          onChange={onUpdateCode}
          isDisabled={isJoining}
        />
        <h1 className="font-bold text-2xl mb-2 text-center">Player Name</h1>
        <BingoInput
          className="md:max-w-2xl p-4 text-2xl text-center mb-1"
          placeholder="e.g. Len Beong"
          value={name}
          onChange={onUpdateName}
          isDisabled={isJoining}
        />
        <div className="w-full md:max-w-2xl flex justify-end text-xs mb-8">
          {name.length} / {MAX_NUM_CHARS_SUPERHERO_NAME}
        </div>
        <BingoButton
          text="Join Now!"
          isDisabled={joinCode.length < 6 || name.length === 0}
          isLoading={isJoining}
          onClick={onClickJoin}
          className="md:max-w-2xl p-4 bg-blue border-black border-8"
        />
      </main>
    </>
  );
};

export default Join;

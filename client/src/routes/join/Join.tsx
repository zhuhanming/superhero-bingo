import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Navbar from 'components/navbar';
import { PLAY } from 'constants/routes';
import { RootState } from 'reducers/rootReducer';

const Join: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState('');
  const history = useHistory();
  const isJoining = useSelector(
    (state: RootState) => state.misc.loading.isJoining
  );
  const game = useSelector((state: RootState) => state.game.game);

  useEffect(() => {
    if (game.id !== -1 && game.hasStarted) {
      history.push(PLAY);
    }
  });

  if (game.id !== -1) {
    return (
      <div>
        <Navbar />
        <main
          style={{ minHeight: 'calc(100vh - 6rem)' }}
          className="flex flex-col justify-center items-center text-center"
        >
          <h1 className="font-bold text-3xl mb-12">
            Waiting for the game to start...
          </h1>
          <h1 className="font-bold text-2xl mb-2 text-center text-red">
            You should see your name on the screen!
          </h1>
        </main>
      </div>
    );
  }

  const onUpdateCode = (newCode: string) => {
    if (
      newCode.length > 6 ||
      (newCode.length > 0 && !newCode.match(/^[0-9a-zA-Z]+$/))
    ) {
      return;
    }
    setJoinCode(newCode.toUpperCase());
  };

  const onClickJoin = () => {
    // do something
  };

  return (
    <div>
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
          className="md:max-w-2xl p-4 text-2xl text-center mb-8"
          placeholder="e.g. Len Beong"
          value={name}
          onChange={setName}
          isDisabled={isJoining}
        />
        <BingoButton
          text="Join Now!"
          isDisabled={joinCode.length < 6 || name.length === 0}
          isLoading={isJoining}
          onClick={onClickJoin}
          className="md:max-w-2xl p-4 bg-blue border-black border-8"
        />
      </main>
    </div>
  );
};

export default Join;

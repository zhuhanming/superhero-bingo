/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Leaderboard from 'components/leaderboard';
import SuperpowerGrid from 'components/superpowerGrid';
import { JOIN, ROOT } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import { clearBingo } from 'reducers/bingoDux';
import { clearGameDux, clearInviteToSign } from 'reducers/gameDux';
import { RootState } from 'reducers/rootReducer';
import { fetchGameUserToken, leaveGame } from 'services/gameService';
import { fetchInvite, signInvite } from 'services/inviteService';
import { callbackHandler } from 'utils/callbackHandler';

enum PlayTab {
  LEADERBOARD,
  SIGN,
}

const Play: React.FC = () => {
  const bingo = useSelector((state: RootState) => state.bingo.bingo);
  const [tab, setTab] = useState(PlayTab.LEADERBOARD);
  const { game, leaderboard, invitations, inviteToSign, self } = useSelector(
    (state: RootState) => state.game
  );
  const [inviteCode, setInviteCode] = useState('');
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (self.token !== '') {
      fetchGameUserToken(socket, self.token);
    } else {
      history.push(ROOT);
    }
  }, []);

  const onClickBackToHome = () => {
    dispatch(clearBingo());
    dispatch(clearGameDux());
    history.push(ROOT);
  };

  if (game.hasEnded) {
    return (
      <main
        className="flex flex-col items-center justify-center"
        style={{ height: 'calc(100vh - 3rem)' }}
      >
        <h1 className="font-bold text-3xl mb-12">The game has ended!</h1>
        <h1 className="font-bold text-2xl mb-16 text-center text-red">
          Please see the main screen for the results!
        </h1>
        <BingoButton
          text="Back to Home Page"
          onClick={onClickBackToHome}
          className="text-lg p-2 bg-red border-black border-4 mt-4"
        />
      </main>
    );
  }

  const onChangeInviteCode = (newCode: string) => {
    if (
      newCode.length > 8 ||
      (newCode.length > 0 && !newCode.match(/^[0-9a-zA-Z]+$/))
    ) {
      return;
    }
    dispatch(clearInviteToSign());
    setInviteCode(newCode.toUpperCase());
    if (newCode.length === 8) {
      fetchInvite(socket, newCode, self.token);
    }
  };

  const onClickSign = () => {
    if (inviteToSign == null) {
      return;
    }
    callbackHandler.signInviteCallback = () => setInviteCode('');
    signInvite(socket, inviteToSign.inviteCode, self.token);
  };

  const onClickLeaveGame = () => {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(
      "Are you sure you wish to leave the game? You won't be able to join back."
    );
    if (confirm) {
      callbackHandler.leaveGameCallback = () => history.push(JOIN);
      leaveGame(socket, self.token);
    }
  };

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
              tab === PlayTab.LEADERBOARD ? 'text-black' : 'text-gray-500'
            }`}
            onClick={() => setTab(PlayTab.LEADERBOARD)}
            onKeyDown={() => setTab(PlayTab.LEADERBOARD)}
          >
            Leaderboard
          </h1>
          <h1
            className={`font-bold text-2xl mb-4 ml-8 cursor-pointer ${
              tab === PlayTab.SIGN ? 'text-black' : 'text-gray-500'
            }`}
            onClick={() => setTab(PlayTab.SIGN)}
            onKeyDown={() => setTab(PlayTab.SIGN)}
          >
            Sign
          </h1>
        </div>
        {tab === PlayTab.LEADERBOARD ? (
          <>
            <Leaderboard
              superheroes={game.heroes}
              leaderboard={leaderboard}
              numSuperpowers={bingo.superpowers.length}
              className="flex-1 overflow-scroll"
            />
            <BingoButton
              text="Leave Game"
              onClick={onClickLeaveGame}
              className="text-lg p-2 bg-red border-black border-4 mt-4"
            />
          </>
        ) : tab === PlayTab.SIGN ? (
          <div className="flex-1">
            <h1 className="font-bold text-2xl mb-2">Superpower Box Code</h1>
            <BingoInput
              placeholder="Enter the superpower box code here"
              value={inviteCode}
              onChange={onChangeInviteCode}
              className="p-4 text-xl mb-8"
            />
            <h1 className="font-bold text-2xl mb-2">Details</h1>
            {inviteToSign == null ? (
              <p className="font-regular">
                Enter an invite code to view details.
              </p>
            ) : (
              <>
                <p className="font-regular text-md">
                  You are signing superpower:
                </p>
                <p className="font-medium text-2xl">
                  {inviteToSign.superpowerDescription}
                </p>
                <p className="font-regular text-md">for superhero:</p>
                <p className="font-medium text-2xl mb-4">
                  {inviteToSign.ownerName}
                </p>
              </>
            )}
            <BingoButton
              text="Sign Superpower!"
              isDisabled={inviteToSign == null}
              onClick={onClickSign}
              className="text-lg p-2 bg-blue border-black border-4 mt-2"
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Play;

/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Leaderboard from 'components/leaderboard';
import SuperpowerGrid from 'components/superpowerGrid';
import { useSocket } from 'contexts/SocketContext';
import { clearInviteToSign } from 'reducers/gameDux';
import { RootState } from 'reducers/rootReducer';
import { fetchInvite, signInvite } from 'services/inviteService';

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
    signInvite(socket, inviteToSign.inviteCode, self.token);
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
              className="text-lg p-2 bg-red border-black border-4 mt-2"
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Play;

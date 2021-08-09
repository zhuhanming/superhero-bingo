import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NUM_CHARS_OWNER_CODE } from 'shared';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Navbar from 'components/navbar';
import { EDIT, GAME } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import { clearBingo } from 'reducers/bingoDux';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { fetchBingo } from 'services/bingoService';
import { fetchGameOwnerCode } from 'services/gameService';
import { callbackHandler } from 'utils/callbackHandler';

const Start: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isFetching = useSelector(
    (state: RootState) => state.misc.loading.isFetching
  );
  const ownerCode = useSelector(
    (state: RootState) => state.bingo.bingo.ownerCode
  );
  const { socket } = useSocket();
  const [code, setCode] = useState('');

  useEffect(() => {
    dispatch(updateLoadingState({ isFetching: false }));
  }, []);

  useEffect(() => {
    if (ownerCode != null) {
      callbackHandler.fetchGameOwnerCodeCallback = () => history.push(GAME);
      fetchGameOwnerCode(socket, ownerCode);
    }
  }, []);

  const onClickCreate = async () => {
    if (isFetching) return;
    dispatch(clearBingo());
    history.push(EDIT);
  };

  const onClickUpdate = async () => {
    if (isFetching || code.length < 6) return;
    dispatch(updateLoadingState({ isFetching: true }));
    callbackHandler.fetchBingoCallback = () => {
      history.push(EDIT);
    };
    fetchBingo(socket, code);
  };

  const onUpdateCode = (newCode: string) => {
    if (
      newCode.length > NUM_CHARS_OWNER_CODE ||
      (newCode.length > 0 && !newCode.match(/^[0-9a-zA-Z]+$/))
    ) {
      return;
    }
    setCode(newCode.toUpperCase());
    dispatch(clearBingo());
  };

  return (
    <>
      <Navbar />
      <main
        style={{ minHeight: 'calc(100vh - 6rem)' }}
        className="flex flex-col justify-center items-center text-center"
      >
        <h1 className="font-bold text-3xl mb-12">
          Get Started with Superpower Creation!
        </h1>
        <BingoButton
          text="Create New Collection"
          isDisabled={isFetching}
          onClick={onClickCreate}
          className="md:max-w-2xl p-4 bg-blue border-black border-8"
        />
        <h1 className="font-bold text-lg my-8">- OR -</h1>
        <BingoInput
          className="md:max-w-2xl p-4 text-2xl text-center mb-8"
          placeholder="A1B24C6"
          value={code}
          onChange={onUpdateCode}
          isDisabled={isFetching}
        />
        <BingoButton
          text="Edit Existing Collection"
          isDisabled={code.length < 6}
          isLoading={isFetching}
          onClick={onClickUpdate}
          className="md:max-w-2xl p-4 bg-blue border-black border-8"
        />
      </main>
    </>
  );
};

export default Start;

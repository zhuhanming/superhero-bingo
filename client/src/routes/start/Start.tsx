import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BingoButton from 'components/bingoButton';
import Navbar from 'components/navbar';
import { EDIT } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import { clearBingo } from 'reducers/bingoDux';
import { updateErrorMessages } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { fetchBingo } from 'services/socketRequestService';

const Start: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const fetchErrorMessage = useSelector(
    (state: RootState) => state.misc.errors.fetchBingoError
  );
  const bingoId = useSelector((state: RootState) => state.bingo.bingo.id);
  const { socket } = useSocket();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (fetchErrorMessage.length > 0) {
      setIsLoading(false);
    }
  }, [fetchErrorMessage]);

  useEffect(() => {
    if (bingoId !== -1) {
      history.push(EDIT);
    }
  }, [bingoId]);

  const onClickCreate = async () => {
    if (isLoading) return;
    history.push(EDIT);
  };

  const onClickUpdate = async () => {
    if (isLoading || code.length < 6) return;
    dispatch(updateErrorMessages({ fetchBingoError: '' }));
    setIsLoading(true);
    fetchBingo(socket, code);
  };

  const onUpdateCode = (newCode: string) => {
    if (
      newCode.length > 6 ||
      (newCode.length > 0 && !newCode.match(/^[0-9a-zA-Z]+$/))
    ) {
      return;
    }
    setCode(newCode.toUpperCase());
    dispatch(updateErrorMessages({ fetchBingoError: '' }));
    dispatch(clearBingo());
  };

  return (
    <div>
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
          isDisabled={isLoading}
          onClick={onClickCreate}
          className="md:max-w-2xl p-4 bg-blue border-black border-8"
        />
        <h1 className="font-bold text-lg my-8">- OR -</h1>
        <input
          className="w-full md:max-w-2xl rounded-xl p-4 text-2xl text-center font-medium mb-8"
          placeholder="A1B24C6"
          value={code}
          onChange={(e) => onUpdateCode(e.target.value)}
          disabled={isLoading}
        />
        <BingoButton
          text={isLoading ? 'Loading...' : 'Edit Existing Collection'}
          isDisabled={code.length < 6}
          isLoading={isLoading}
          onClick={onClickUpdate}
          className="md:max-w-2xl p-4 bg-blue border-black border-8"
        />
        <h2 className="text-red mt-2">{fetchErrorMessage ?? ' '}</h2>
      </main>
    </div>
  );
};

export default Start;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Navbar from 'components/navbar';
import { EDIT } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import { clearBingo } from 'reducers/bingoDux';
import { fetchBingo } from 'services/socketRequestService';

const Start: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const onClickCreate = async () => {
    if (isLoading) return;
    dispatch(clearBingo());
    history.push(EDIT);
  };

  const onClickUpdate = async () => {
    if (isLoading || code.length < 6) return;
    setIsLoading(true);
    fetchBingo(socket, code);
    history.push(EDIT);
  };

  const onUpdateCode = (newCode: string) => {
    if (
      newCode.length > 6 ||
      (newCode.length > 0 && !newCode.match(/^[0-9a-zA-Z]+$/))
    ) {
      return;
    }
    setCode(newCode.toUpperCase());
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
        <button
          type="button"
          className={`w-full md:max-w-2xl font-bold text-lg p-4 bg-blue rounded-xl border-black border-8 transform transition duration-500 shadow-lg ${
            isLoading ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
          }`}
          disabled={isLoading}
          onClick={onClickCreate}
        >
          Create New Collection
        </button>
        <h1 className="font-bold text-lg my-12">- OR -</h1>
        <input
          className="w-full md:max-w-2xl rounded-xl p-4 text-2xl text-center font-medium mb-8"
          placeholder="A1B24C6"
          value={code}
          onChange={(e) => onUpdateCode(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="button"
          className={`w-full md:max-w-2xl font-bold text-lg p-4 bg-blue rounded-xl border-black border-8 transform transition duration-500 shadow-lg ${
            isLoading ? 'animate-pulse' : 'hover:scale-105'
          } ${code.length < 6 ? 'cursor-not-allowed opacity-60' : ''}`}
          disabled={isLoading || code.length < 6}
          onClick={onClickUpdate}
        >
          {isLoading ? 'Loading...' : 'Edit Existing Collection'}
        </button>
      </main>
    </div>
  );
};

export default Start;

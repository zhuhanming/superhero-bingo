/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { IO_CONNECT } from 'shared';
import { io, Socket } from 'socket.io-client';

export default interface SocketContextInterface {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextInterface | undefined>(
  undefined
);

const SocketProvider: React.FunctionComponent = (props) => {
  const socket = io(`${process.env.REACT_APP_BACKEND_API}}`, {
    reconnection: false,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    rejectUnauthorized: false,
    transports: ['websocket', 'polling'],
  });

  socket.on(IO_CONNECT, () => {
    // eslint-disable-next-line no-console
    console.log('Socket connected!');
  });

  socket.on('connect_error', (err) => {
    // eslint-disable-next-line no-console
    console.error(`connect_error due to ${err.message}`);
  });

  return <SocketContext.Provider value={{ socket }} {...props} />;
};

const useSocket = (): SocketContextInterface => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error(`useSocket must be used within a SocketProvider`);
  }
  return context;
};

export { SocketProvider, useSocket };

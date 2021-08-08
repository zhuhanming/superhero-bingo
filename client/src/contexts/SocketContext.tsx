/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { CONNECT } from 'shared';
import { io, Socket } from 'socket.io-client';

import { initalizeSocket } from 'services/socketResponseService';

export default interface SocketContextInterface {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextInterface | undefined>(
  undefined
);

const SocketProvider: React.FunctionComponent = (props) => {
  const socket = io(`${process.env.REACT_APP_BACKEND_API}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  });

  useEffect(() => {
    socket.on(CONNECT, () => {
      // eslint-disable-next-line no-console
      console.log('Socket connected!');
      initalizeSocket(socket);
    });
    socket.on('connect_error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`connect_error due to ${err.message}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (eventName: string, ...args: any) => {
      // eslint-disable-next-line no-console
      console.log(eventName, args);
    };

    socket.onAny(listener);

    return () => {
      socket.disconnect();
    };
  }, [socket]);

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

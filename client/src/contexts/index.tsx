import React from 'react';

import { SocketProvider } from './SocketContext';

const AppProviders: React.FC = ({ children }) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default AppProviders;

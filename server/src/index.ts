import dotenv from 'dotenv';

import { ApiServer } from './server';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const apiServer = new ApiServer();
apiServer.initialize();

const cleanUp = async (signal: string) => {
  await apiServer.close();
  process.kill(process.pid, signal);
};

const signals = ['SIGINT', 'SIGHUP', 'SIGQUIT', 'SIGTERM', 'uncaughtException'];
signals.forEach((signal) => process.on(signal, cleanUp));

export default apiServer;

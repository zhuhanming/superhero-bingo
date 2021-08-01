import dotenv from 'dotenv';

import { beforeShutdown } from 'utils/shutdownUtils';

import { ApiServer } from './server';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const apiServer = new ApiServer();
apiServer.initialize();

beforeShutdown(async (_signal: string) => await apiServer.close());

export default apiServer;

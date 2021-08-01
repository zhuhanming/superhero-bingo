import dotenv from 'dotenv';

import { ApiServer } from './server';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const apiServer = new ApiServer();
apiServer.initialize();

process.on('SIGTERM', apiServer.close);

export default apiServer;

import cors, { CorsOptions } from 'cors';
import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';

import setUpIo from 'socket';

import routes from './routes';

const corsOptions: CorsOptions = {
  // TODO: Fix the production URL once deployed
  origin: process.env.NODE_ENV === 'production' ? /.*netlify\.app.*/ : '*',
};

export class ApiServer {
  public server: Server | null = null;
  public io: SocketServer | null = null;

  async initialize(port = 3001): Promise<void> {
    const app = express();
    app.use(express.json({ limit: '20mb' }) as RequestHandler);
    app.use(
      express.urlencoded({ extended: true, limit: '20mb' }) as RequestHandler
    );
    app.use(cors(corsOptions));
    app.use(helmet() as RequestHandler);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Express server has started on port ${port}.`);
      app.use(morgan('dev') as RequestHandler);
    }
    app.use(routes);

    const server = app.listen(port);
    server.timeout = 1200000;
    const io = new SocketServer(server);
    setUpIo(io);

    this.server = server;
    this.io = io;
  }

  async close(): Promise<void> {
    this.server && this.server.close();
    this.io && this.io.close();
  }
}

export default ApiServer;
import * as utilities from './utilities';
import { WebSocketExpress } from 'websocket-express';
import * as express from 'express';
import { appRouter } from './app.router';
import * as middleware from './middleware';
import { Server } from 'http';
import * as cors from 'cors';


const debug = require('debug')('app:startup');
const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 8080);

export var server: Server;

export var app: WebSocketExpress;

export async function start(): Promise<void> {

    debug('booting');

    await utilities.database.connect();

    app = new WebSocketExpress();

    app.use(cors.default());
    app.use(express.json());

    app.use('/', appRouter);

    app.use(middleware.errors.notFound);
    app.use(middleware.errors.validation);
    app.use(middleware.errors.request);
    app.use(middleware.errors.unauthorized);
    app.use(middleware.errors.internalServerError);

    app.use(middleware.errors.pathNotFound);

    server = app.createServer();
    server.listen(port, host, () => {
        debug(`Listening on: ${host}:${port}`);
    });
}

export async function stop(): Promise<void> {
    server.close();
    await utilities.database.disconnect();
}


if (require.main === module) {
    start();
}

import { NextFunction, Request, Response } from "express";
import { WSResponse } from "websocket-express";
import { WebSocket } from "ws";
import { IGame, IUser } from "../interfaces/models";

import * as services from '../database/services';
import * as requests from '../interfaces/requests';
import * as responses from '../interfaces/responses';
import * as utilities from '../utilities';
import * as errors from '../classes/errors';

import { HydratedDocument, Types } from "mongoose";
import { ChangeStreamDocument } from "mongodb";
import { GameModel, GameSchema } from "../database/models";

const debug = require('debug')('app:middleware:games');

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('create');

        const request = res.locals.body as Omit<IGame, '_id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>;

        const document = await services.games.create(request);

        res.locals.result = document;

        next();
    } catch (error) {
        next(error);
    }
}

export async function read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('read');

        const { id } = res.locals.params as requests.IId;

        const document = await services.games.read(new Types.ObjectId(id));

        if (document === null) {
            throw errors.NotFoundError.byId('games');
        }

        res.locals.result = document;

        next();
    } catch (error) {
        next(error);
    }
}

export async function readAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('readAll');

        const documents = await services.games.readAll();

        res.locals.result = {
            items: documents
        } as responses.IListResponse<IGame>;

        next();
    } catch (error) {
        next(error);
    }
}


export async function wsStreamAllChanges(req: Request, res: WSResponse, next: NextFunction): Promise<void> {
    try {
        debug('open wsStreamChanges');
        const ws = res.locals.ws as WebSocket;

        const stream = new utilities.streams.ListStream('games', ws);

        const documents = await services.games.readAll();

        stream.init(documents);

        const changeStream = services.games.streamChanges().on('change', (change: ChangeStreamDocument<IGame>) => {
            if (change.operationType === 'insert') {
                const document = new GameModel(change.fullDocument);
                stream.insert(document);
            } else if (change.operationType === 'update') {
                const document = new GameModel(change.fullDocument);

                if (!document.deleted) {
                    stream.update(document);
                } else {
                    stream.delete(document._id);
                }
            }
        });

        ws.on('close', () => {
            debug('closing wsStreamChanges')
            changeStream.close();
        });
        next();
    } catch (error) {
        next(error);
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('update');

        const request = res.locals.body as Partial<IGame>;
        const document = res.locals.result as HydratedDocument<IGame, unknown, unknown>;

        const updated = await services.games.update(document, request);

        res.locals.result = updated;

        next();
    } catch (error) {
        next(error);
    }
}

export async function softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug(read);

        const document = res.locals.result as HydratedDocument<IGame, unknown, unknown>;

        const deleted = await services.games.softDelete(document);

        res.locals.result = deleted;

        next();
    } catch (error) {
        next(error);
    }
}
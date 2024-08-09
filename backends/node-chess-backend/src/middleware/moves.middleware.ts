import { NextFunction, Request, Response } from "express";
import { IMove } from "../interfaces/models";
import * as services from "../database/services";
import * as requests from "../interfaces/requests";
import * as responses from "../interfaces/responses";
import * as errors from "../classes/errors";
import { HydratedDocument, Types } from "mongoose";

const debug = require('debug')('app:middleware:moves');

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('create');

        const body = res.locals.body as Omit<IMove, '_id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>;

        const model = await services.moves.create(body);

        res.locals.result = model;

        next();
    } catch (error) {
        next(error);
    }
}

export async function read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('read');

        const { id } = res.locals.params as requests.IId;

        const model = await services.moves.read(new Types.ObjectId(id));

        if (model === null) {
            throw errors.NotFoundError.byId('move');
        }

        res.locals.result = model;

        next();
    } catch (error) {
        next(error);
    }
}

export async function readAllByGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('readAllByGame');

        const { id } = res.locals.params as requests.IId;

        const models = await services.moves.readByGameId(new Types.ObjectId(id));

        res.locals.result = {
            items: models
        } as responses.IListResponse<IMove>;

        next();
    } catch (error) {
        next(error);
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('update');

        const model = res.locals.result as HydratedDocument<IMove, unknown, unknown>;
        const updates = res.locals.body as Partial<IMove>;

        const updatedModel = await services.moves.update(model, updates);

        res.locals.result = updatedModel;

        next();
    } catch (error) {
        next(error);
    }
}

export async function softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        debug('softDelete');

        const model = res.locals.result as HydratedDocument<IMove, unknown, unknown>;

        const updatedModel = await services.moves.softDelete(model);

        res.locals.result = updatedModel;

        next();
    } catch (error) {
        next(error);
    }
}
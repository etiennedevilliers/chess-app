import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/models";

import * as services from '../database/services';
import * as requests from '../interfaces/requests';
import * as utilities from '../utilities/password';
import * as errors from '../classes/errors';

import { Types } from "mongoose";

const debug = require('debug')('app:middleware:users');

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        debug('Executing create');

        const request = res.locals.body as requests.ICreateUserRequest;

        const existing = await services.users.findByUnique(request.unique);

        if (existing !== null) {
            throw new errors.RequestError(
                'Unique already exists',
                'A user with that unique already exists'
            );
        }

        const created = await services.users.create({
            unique: request.unique,
            passwordHash: await utilities.hash(request.password)
        });

        res.locals.result = created;

        next();
    } catch (error) {
        next(error);
    }
}

export async function read(req: Request, res: Response, next: NextFunction) {
    try {
        debug('Executing read');

        const { id } = res.locals.params as requests.IId;

        const document = await services.users.read(new Types.ObjectId(id));

        if (document === null) {
            throw errors.NotFoundError.byId('User');
        }

        res.locals.result = document;
        next();
    } catch (error) {
        next(error);
    }
}
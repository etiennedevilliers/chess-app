import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/models";

import * as services from '../database/services';
import * as requests from '../interfaces/requests';
import * as utilities from '../utilities';
import * as errors from '../classes/errors';

import { Types } from "mongoose";

const debug = require('debug')('app:authentication:users');

function buildLoginError(): errors.UnauthorizedError {
    return new errors.UnauthorizedError(
        'Credentials are incorrect'
    )
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const request = res.locals.body as requests.ILogin;

        const user = await services.users.findByUnique(request.unique);

        if (user === null) { throw buildLoginError(); }

        const passwordIsCorrect = await utilities.password.compare(
            request.password,
            user!.passwordHash
        )

        if (!passwordIsCorrect) { throw buildLoginError(); }

        const jwt = utilities.jwt.sign(user!);

        res.locals.result = {
            user,
            jwt
        };
        next()
    } catch (error) {
        next(error);
    }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const bearer = req.headers.authorization;

        if (bearer === undefined) {
            throw new errors.UnauthorizedError('Bearer token is undefined');
        }

        const bearerSplit = bearer.split(' ');

        if (bearerSplit.length !== 2) {
            throw new errors.UnauthorizedError('Bearer token is malformed');
        }

        const token = await utilities.jwt.verify(bearerSplit[1]);

        if (token === undefined) {
            throw new errors.UnauthorizedError('Bearer token is invalid');
        }

        res.locals.payload = token;

        next();
    } catch (error) {
        next(error);
    }
}
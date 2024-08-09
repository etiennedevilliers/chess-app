import { NextFunction, Request, Response } from "express";

import * as errors from '../classes/errors';

const debug = require('debug')('app:middleware:errors');

export function notFound(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof errors.NotFoundError) {
        debug('Executing notFound');
        res.status(404)
            .send((error as errors.NotFoundError).build());
    } else {
        next(error);
    }
}

export function request(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof errors.RequestError) {
        debug('Executing request');
        res.status(400)
            .send((error as errors.RequestError).build());
    } else {
        next(error);
    }
}

export function unauthorized(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof errors.UnauthorizedError) {
        debug('Executing request');
        res.status(401)
            .send((error as errors.UnauthorizedError).build());
    } else {
        next(error);
    }
}

export function validation(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof errors.ValidationError) {
        debug('Executing validation');
        
        const validationError = error as errors.ValidationError

        res.status(400)
            .send(validationError.build());
    } else {
        next(error);
    }
}

export function internalServerError(error: any, req: Request, res: Response, next: NextFunction) {
    debug('Executing internalServerError');
    debug(error);
    res.status(500).send(new errors.InternalServerError(error).build());
}

export function pathNotFound(req: Request, res: Response, next: NextFunction) {
    debug('Executing pathNotFound');
    res.status(404).send(errors.NotFoundError.path(req.path).build());
}
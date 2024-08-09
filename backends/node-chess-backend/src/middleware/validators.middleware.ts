import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import * as errors from '../classes/errors';

const debug = require('debug')('app:middleware:validators');

export function body(schema: Joi.ObjectSchema<any>) {
    return function(req: Request, res: Response, next: NextFunction) {
        try {
            debug('Executing body');
            const result = schema.validate(req.body);

            if (result.error !== undefined) {
                throw errors.ValidationError.body(result.error);
            }

            res.locals.body = result.value;

            next();
        } catch (error) {
            next(error);
        }
    }
}

export function params(schema: Joi.ObjectSchema<any>) {
    return function(req: Request, res: Response, next: NextFunction) {
        try {
            debug('Executing params');
            const result = schema.validate(req.params);

            if (result.error !== undefined) {
                throw errors.ValidationError.params(result.error);
            }

            res.locals.params = result.value;

            next();
        } catch (error) {
            next(error);
        }
    }
} 

export function query(schema: Joi.ObjectSchema<any>) {
    return function(req: Request, res: Response, next: NextFunction) {
        try {
            debug('Executing query');

            const result = schema.validate(req.query);

            if (result.error !== undefined) {
                throw errors.ValidationError.query(result.error);
            }

            res.locals.query = result.value;

            next();
        } catch (error) {
            next(error);
        }
    }
} 

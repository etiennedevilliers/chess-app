import { EErrorTitles } from "../../enums/error-titles.enum";
import { IError } from "../../interfaces/responses";

import * as Joi from 'joi';

export class ValidationError {
    location: string;
    reason: Joi.ValidationError;

    constructor(location: string, reason: Joi.ValidationError) {
        this.location = location;
        this.reason = reason;
    }

    build(): IError {
        return {
            error: EErrorTitles.VALIDATION,
            title: `Error validating ${this.location}`,
            reason: this.reason.details,
        } as IError;
    }

    static body(reason: any): ValidationError {
        return new ValidationError('body', reason);
    }

    static params(reason: any): ValidationError {
        return new ValidationError('params', reason);
    }

    static query(reason: any): ValidationError {
        return new ValidationError('query', reason);
    }
}
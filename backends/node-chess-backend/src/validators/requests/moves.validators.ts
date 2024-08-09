import * as Joi from 'joi';
import { IMove, IPosition } from '../../interfaces/models';
import { objectId } from './general.validators';

const position = Joi.object<IPosition>({
    column: Joi.string().regex(/^[a-h]$/).required(),
    row: Joi.number().min(1).max(8).required()
});

export const create = Joi.object<IMove>({
    from: position.required(),
    to: position.required(),
    gameId: objectId.required()
});

export const update = Joi.object<IMove>({
    from: position.required(),
    to: position.required(),
});

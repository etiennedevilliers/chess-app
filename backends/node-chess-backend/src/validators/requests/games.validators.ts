import * as Joi from 'joi';
import { IGame } from '../../interfaces/models';
import { objectId } from './general.validators';

export const create = Joi.object<IGame>({
    name: Joi.string().required().min(1),
    whitePlayerId: objectId.required().allow(null),
    blackPlayerId: objectId.required().allow(null)
});

export const update = Joi.object<IGame>({
    whitePlayerId: objectId.required().allow(null),
    blackPlayerId: objectId.required().allow(null)
});


import * as Joi from 'joi';
import { password } from '../../utilities';

export const create = Joi.object({
    unique: Joi.string().min(5).required(),
    password: Joi.string().min(5).required()
});
import * as Joi from 'joi';
import { ILogin } from '../../interfaces/requests/authentication/login.interface';

export const login = Joi.object<ILogin>({
    unique: Joi.string().required(),
    password: Joi.string().required(),
});

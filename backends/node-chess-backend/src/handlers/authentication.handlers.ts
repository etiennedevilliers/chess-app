import * as middleware from '../middleware';
import * as validators from '../validators';

export const login = [
    middleware.validators.body(validators.requests.authentication.login),
    middleware.authentication.login,
    middleware.result.ok
];

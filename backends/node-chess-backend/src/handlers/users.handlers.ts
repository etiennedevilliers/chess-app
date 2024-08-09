import * as middleware from '../middleware';
import * as validators from '../validators';

export const create = [
    middleware.validators.body(validators.requests.users.create),
    middleware.users.create,
    middleware.result.created
];

export const read  = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.users.read,
    middleware.result.ok
]
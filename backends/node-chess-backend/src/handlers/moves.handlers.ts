import * as middleware from '../middleware';
import * as validators from '../validators';

export const create = [
    middleware.authentication.authenticate,
    middleware.validators.body(validators.requests.moves.create),
    middleware.moves.create,
    middleware.result.created
];

export const read = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.moves.read,
    middleware.result.ok
];

export const readAllByGame = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.moves.readAllByGame,
    middleware.result.ok,
];

export const update = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.validators.body(validators.requests.moves.update),
    middleware.moves.read,
    middleware.moves.update,
    middleware.result.ok,
];

export const softDelete = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.moves.read,
    middleware.moves.softDelete,
    middleware.result.noContent,
];

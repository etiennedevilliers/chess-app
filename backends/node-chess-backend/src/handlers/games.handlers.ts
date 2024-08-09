import * as middleware from '../middleware';
import * as validators from '../validators';

export const create = [
    middleware.authentication.authenticate,
    middleware.validators.body(validators.requests.games.create),
    middleware.games.create,
    middleware.result.created,
];

export const readAll = [
    middleware.authentication.authenticate,
    middleware.games.readAll,
    middleware.result.ok,
];

export const stream = [
    middleware.authentication.authenticate,
    middleware.websocket.upgrade,
    middleware.games.wsStreamAllChanges,
    middleware.websocket.keepConnectionOpen
];

export const read = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.games.read,
    middleware.result.ok,
];

export const update = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.validators.body(validators.requests.games.update),
    middleware.games.read,
    middleware.games.update,
    middleware.result.ok,
];

export const softDelete = [
    middleware.authentication.authenticate,
    middleware.validators.params(validators.requests.general.idRequest),
    middleware.games.read,
    middleware.games.softDelete,
    middleware.result.noContent
];

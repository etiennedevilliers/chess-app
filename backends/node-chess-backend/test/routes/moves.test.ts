import test from 'superwstest';
import { HydratedDocument, Types } from 'mongoose';
import { expect, use } from 'chai';

import * as root from '../../src/index';
import * as services from '../../src/database/services';
import * as utilities from '../../src/utilities';

import { ICreateUserRequest } from '../../src/interfaces/requests';
import { IGame, IMove, IUser } from '../../src/interfaces/models';
import { games } from '../../src/middleware';
import exp from 'constants';
import { IListInitEvent, IStreamMessage } from '../../src/interfaces/stream';
import { EStreamListEvents } from '../../src/enums';
import { IListEvent } from '../../src/interfaces/stream/list.event';

var user: HydratedDocument<IUser, unknown, unknown>;
var jwt: string;

var gameModel: HydratedDocument<IGame, unknown, unknown>;
var models: HydratedDocument<IMove, unknown, unknown>[];
var deletedModel: HydratedDocument<IMove, unknown, unknown>;

describe('routes:moves', () => {
    beforeEach(async () => {
        await utilities.database.clear();
        
        user = await services.users.create({
            unique: 'test.user',
            passwordHash: 'hash'
        });
        
        jwt = utilities.jwt.sign(user);

        gameModel = await services.games.create({
            name: 'game',
            whitePlayerId: undefined,
            blackPlayerId: undefined
        }),

        models = [
            await services.moves.create({
                from: {
                    column: 'a',
                    row: 1
                },
                to: {
                    column: 'b',
                    row: 1,
                },
                gameId: gameModel._id
            }),
            await services.moves.create({
                from: {
                    column: 'a',
                    row: 1
                },
                to: {
                    column: 'b',
                    row: 1,
                },
                gameId: new Types.ObjectId()
            }),
        ];

        deletedModel = await services.moves.create({
            from: {
                column: 'a',
                row: 1
            },
            to: {
                column: 'b',
                row: 1,
            },
            gameId: new Types.ObjectId()
        }),
        deletedModel = await services.moves.softDelete(deletedModel);
    });

    describe('create', () => {
        it('should create correctly', async () => {
            const model = {
                from: {
                    column: 'a',
                    row: 1
                },
                to: {
                    column: 'b',
                    row: 1,
                },
                gameId: new Types.ObjectId().toHexString()
            };
    
            const res = await test(root.server)
                .post('/moves')
                .set('Authorization', `Bearer ${jwt}`)
                .send(model);
    
            expect(res.statusCode).is.equal(201);
            expect(res.body.gameId).is.equal(model.gameId);
    
            const document = await services.moves.read(new Types.ObjectId(res.body.id as string));
    
            expect(document).is.not.null;
            expect(document!.gameId.toHexString()).is.equal(model.gameId);
        });
    });

    describe('read', () => {
        it('should read correctly', async () => {
            for (const model of models) {
                const res = await test(root.server)
                    .get(`/moves/${model._id}`)
                    .set('Authorization', `Bearer ${jwt}`);
    
                expect(res.statusCode).to.equal(200);
                expect(res.body.gameId).to.equal(model.gameId.toHexString());
            }
        });

        it('should not read deleted document', async () => {
            const res = await test(root.server)
                    .get(`/moves/${deletedModel._id}`)
                    .set('Authorization', `Bearer ${jwt}`);
    
            expect(res.statusCode).to.equal(404);
        });
    });  
    
    describe('readAllByGame', () => {
        it('should read all documents', async () => {
            const res = await test(root.server)
                .get(`/games/${gameModel._id}/moves`)
                .set('Authorization', `Bearer ${jwt}`)
                .send();

            expect(res.statusCode).to.equal(200);
            expect(res.body.items.length).to.equal(1);
        });
    });

    describe('update', () => {
        it('should update correctly', async () => {
            const updates = {
                from: {
                    column: 'a',
                    row: 1
                },
                to: {
                    column: 'c',
                    row: 2,
                }
            };

            const res = await test(root.server)
                .patch(`/moves/${models[0]._id}`)
                .set('Authorization', `Bearer ${jwt}`)
                .send(updates);

            expect(res.statusCode).to.equal(200);
            expect(res.body.to.column).to.equal(updates.to.column);
        });
    });

    describe('softDelete', () => {
        it('should delete correctly', async () => {
            const res = await test(root.server)
                .delete(`/moves/${models[0]._id}`)
                .set('Authorization', `Bearer ${jwt}`)
                .send();

            expect(res.statusCode).to.equal(204);
            
            const model = await services.games.read(models[0]._id);

            expect(model).to.be.null;
        });
    });
});

import test from 'superwstest';
import { HydratedDocument, Types } from 'mongoose';
import { expect, use } from 'chai';

import * as root from '../../src/index';
import * as services from '../../src/database/services';
import * as utilities from '../../src/utilities';

import { ICreateUserRequest } from '../../src/interfaces/requests';
import { IGame, IUser } from '../../src/interfaces/models';
import { games } from '../../src/middleware';
import exp from 'constants';
import { IListInitEvent, IStreamMessage } from '../../src/interfaces/stream';
import { EStreamListEvents } from '../../src/enums';
import { IListEvent } from '../../src/interfaces/stream/list.event';

var user: HydratedDocument<IUser, unknown, unknown>;
var jwt: string;

var models: HydratedDocument<IGame, unknown, unknown>[];
var deletedModel: HydratedDocument<IGame, unknown, unknown>;

describe('routes:games', () => {
    beforeEach(async () => {
        await utilities.database.clear();
        
        user = await services.users.create({
            unique: 'test.user',
            passwordHash: 'hash'
        });
        
        jwt = utilities.jwt.sign(user);

        models = [
            await services.games.create({
                name: 'game 1',
                whitePlayerId: new Types.ObjectId(),
                blackPlayerId: new Types.ObjectId()
            }),
            await services.games.create({
                name: 'game 2',
                whitePlayerId: undefined,
                blackPlayerId: undefined
            }),
        ];

        deletedModel = await services.games.create({
            name: 'deleted',
            whitePlayerId: new Types.ObjectId(),
            blackPlayerId: new Types.ObjectId()
        });
        deletedModel = await services.games.softDelete(deletedModel);
    });

    describe('create', () => {
        it('should create correctly', async () => {
            const model = {
                name: 'game',
                whitePlayerId: new Types.ObjectId().toHexString(),
                blackPlayerId: new Types.ObjectId().toHexString(),
            };
    
            const res = await test(root.server)
                .post('/games')
                .set('Authorization', `Bearer ${jwt}`)
                .send(model);
    
            expect(res.statusCode).is.equal(201);
            expect(res.body.name).is.equal(model.name);
    
            const document = await services.games.read(new Types.ObjectId(res.body.id as string));
    
            expect(document).is.not.null;
            expect(document!.name).is.equal(model.name);
        });
    });

    describe('read', () => {
        it('should read correctly', async () => {
            for (const model of models) {
                const res = await test(root.server)
                    .get(`/games/${model._id}`)
                    .set('Authorization', `Bearer ${jwt}`);
    
                expect(res.statusCode).to.equal(200);
                expect(res.body.name).to.equal(model.name);
            }
        });

        it('should not read deleted document', async () => {
            const res = await test(root.server)
                    .get(`/games/${deletedModel._id}`)
                    .set('Authorization', `Bearer ${jwt}`);
    
            expect(res.statusCode).to.equal(404);
        });
    });  
    
    describe('readAll', () => {
        it('should read all documents', async () => {
            const res = await test(root.server)
                .get('/games/all')
                .set('Authorization', `Bearer ${jwt}`)
                .send();

            expect(res.statusCode).to.equal(200);
            expect(res.body.items.length).to.equal(models.length);
        });
    });

    describe('streamAll', () => {
        it('should stream document updates', async () => {
            const chain = test(root.server)
                .ws('/games/stream')
                .set('Authorization', `Bearer ${jwt}`);
            
            await chain.expectJson((json) => {
                expect(json.identifier).to.equal('games');
                expect(json.event.type).to.equal(EStreamListEvents.init);
                expect(json.event.event.documents[0].id).to.equal(models[0].id);
            });
            
            await services.games.update(models[0], { name: 'updated'});

            await chain.expectJson((json) => {
                expect(json.identifier).to.equal('games');
                expect(json.event.type).to.equal(EStreamListEvents.update);
                expect(json.event.event.document.id).to.equal(models[0].id);
                expect(json.event.event.document.name).to.equal('updated');
            });

            await services.games.softDelete(models[0]);

            await chain.expectJson((json) => {
                expect(json.identifier).to.equal('games');
                expect(json.event.type).to.equal(EStreamListEvents.delete);
                expect(json.event.event.id).to.equal(models[0].id);
            });

            const createdModel = await services.games.create({
                name: 'created',
                whitePlayerId: undefined,
                blackPlayerId: undefined
            });

            await chain.expectJson((json) => {
                expect(json.identifier).to.equal('games');
                expect(json.event.type).to.equal(EStreamListEvents.insert);
                expect(json.event.event.document.id).to.equal(createdModel.id);
                expect(json.event.event.document.name).to.equal(createdModel.name);
            });

            chain.close();
        });

        it('should not stream if jwt is missing', async () => {
            const res = await test(root.server)
                .get('/games/stream');

            expect(res.statusCode).to.equal(401);
        });
    });

    describe('update', () => {
        it('should update correctly', async () => {
            const updates = {
                whitePlayerId: new Types.ObjectId().toHexString(),
                blackPlayerId: null,
            };

            const res = await test(root.server)
                .patch(`/games/${models[0]._id}`)
                .set('Authorization', `Bearer ${jwt}`)
                .send(updates);

            expect(res.statusCode).to.equal(200);
            expect(res.body.whitePlayerId).to.equal(updates.whitePlayerId);
            expect(res.body.blackPlayerId).to.be.null;
        });
    });

    describe('softDelete', () => {
        it('should delete correctly', async () => {
            const res = await test(root.server)
                .delete(`/games/${models[0]._id}`)
                .set('Authorization', `Bearer ${jwt}`)
                .send();

            expect(res.statusCode).to.equal(204);
            
            const model = await services.games.read(models[0]._id);

            expect(model).to.be.null;
        });
    });
});

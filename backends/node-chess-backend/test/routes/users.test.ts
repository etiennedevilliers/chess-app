import test from 'superwstest';
import { HydratedDocument, Types } from 'mongoose';
import { expect, use } from 'chai';

import * as root from '../../src/index';
import * as services from '../../src/database/services';
import * as utilities from '../../src/utilities';

import { ICreateUserRequest } from '../../src/interfaces/requests';
import { IUser } from '../../src/interfaces/models';

var user: HydratedDocument<IUser, unknown, unknown>;
var jwt: string;

describe('routes:user', () => {
  beforeEach(async () => {
    utilities.database.clear();
  
    user = await services.users.create({
      unique: 'test.user',
      passwordHash: 'hash'
    });
  
    jwt = utilities.jwt.sign(user);
  });
  
  describe('create', function () {
    it('should correctly create user', async () => {
      const model = {
        unique: 'user@ludere.co.za',
        password: 'password'
      } as ICreateUserRequest;
  
      const res = await test(root.server)
        .post('/users')
        .send(model);
  
      expect(res.statusCode).to.equal(201);
      expect(res.body.unique).to.equal(model.unique);
  
      const document = await services.users.read(
        new Types.ObjectId(res.body.id as string)
      );
  
      expect(document).to.not.be.null;
    });
  
    it('should not create user if unique already exists', async () => {
      const model = {
        unique: user.unique,
        password: 'password'
      } as ICreateUserRequest;
  
      const res = await test(root.server)
        .post('/users')
        .send(model);
  
      expect(res.statusCode).to.equal(400);
    });
  
    it('should correctly create user', async () => {
      const model = {
        unique: '1',
        password: 'password'
      } as ICreateUserRequest;
  
      const res = await test(root.server)
        .post('/users')
        .send(model);
  
      expect(res.statusCode).to.equal(400);
    });
  });
  
  describe('read', function () {
    it('should read user correctly', async () => {
      const res = await test(root.server)
        .get(`/users/${user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send();
  
      expect(res.statusCode).to.equal(200);
    });
  
    it('should not read if jwt is invalid', async() => {
      const res = await test(root.server)
        .get(`/users/${user._id}`)
        .set('Authorization', `Bearer invalid`)
        .send();
  
      expect(res.statusCode).to.equal(401);
    });
  
    it('should not read if jwt is missing', async() => {
      const res = await test(root.server)
        .get(`/users/${user._id}`)
        .send();
  
      expect(res.statusCode).to.equal(401);
    });
  });
});
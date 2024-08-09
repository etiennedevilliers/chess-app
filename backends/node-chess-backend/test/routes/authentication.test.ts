import test from 'superwstest';
import { HydratedDocument, Types } from 'mongoose';
import { expect, use } from 'chai';

import * as root from '../../src/index';
import * as services from '../../src/database/services';
import * as utilities from '../../src/utilities';

import { IUser } from '../../src/interfaces/models';

var user: HydratedDocument<IUser, unknown, unknown>;
var jwt: string;

describe('routes:authentication', () => {
  beforeEach(async () => {
    utilities.database.clear();
  
    user = await services.users.create({
      unique: 'test.user',
      passwordHash: await utilities.password.hash('arduino')
    });
  
    jwt = utilities.jwt.sign(user);
  });
  
  describe('routes:user:create', function () {
    it('should login correctly', async function () {
      const res = await test(root.server)
          .post('/authentication/login')
          .send({
              unique: user.unique,
              password: 'arduino'
          });

      expect(res.statusCode).to.equal(200);
      expect(res.body.user.id).to.equal(user._id.toHexString());
    });

    it('should not login if password is incorrect', async function () {
      const res = await test(root.server)
          .post('/authentication/login')
          .send({
              unique: user.unique,
              password: 'incorrect'
          });

      expect(res.statusCode).to.equal(401);
    });

    it('should not login if unique does not exist', async function () {
      const res = await test(root.server)
          .post('/authentication/login')
          .send({
              unique: 'non-existing-unique',
              password: 'arduino'
          });

      expect(res.statusCode).to.equal(401);
    });
  });
});

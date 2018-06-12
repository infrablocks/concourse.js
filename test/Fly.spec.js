import { expect } from 'chai';
import faker from 'faker';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { buildAuthToken, buildJob } from './builders';

import Fly from '../src/Fly';

const newFly = ({
  uri = faker.internet.url(),
  team = 'main',
  username = 'some-username',
  password = 'some-password',
} = {}) => new Fly({ uri, team, username, password });

describe('Fly', () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });

  after(() => {
    mock.restore();
  });

  describe('construction', () => {
    it('throws an exception if the URI is not provided', () => {
      expect(() => {
        new Fly({})
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" is required].');
    });

    it('throws an exception if the URI is not a string', () => {
      expect(() => {
        new Fly({ uri: 25 })
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" must be a string].');
    });

    it('throws an exception if the URI is not a valid URI', () => {
      expect(() => {
        new Fly({ uri: 'spinach' })
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" must be a valid uri].');
    });

    it('throws an exception if the provided team is not a string', () => {
      expect(
        () => {
          new Fly({
            uri: faker.internet.url(),
            team: 35
          });
        })
        .to.throw(Error, 'Invalid parameter(s): ["team" must be a string].')
    });

    it('throws an exception if the provided username is not a string', () => {
      expect(
        () => {
          new Fly({
            uri: faker.internet.url(),
            username: 35
          });
        })
        .to.throw(Error, 'Invalid parameter(s): ["username" must be a string].')
    });

    it('throws an exception if the provided password is not a string', () => {
      expect(
        () => {
          new Fly({
            uri: faker.internet.url(),
            password: 35
          });
        })
        .to.throw(Error, 'Invalid parameter(s): ["password" must be a string].')
    });
  });

  describe('login', () => {
    it('throws an exception if the username is not provided', async () => {
      try {
        await newFly()
          .login({ password: 'some-password' });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["username" is required].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided username is not a string', async () => {
      try {
        await newFly()
          .login({ username: 25, password: 'some-password' });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["username" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the password is not provided', async () => {
      try {
        await newFly()
          .login({ username: 'some-username' });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["password" is required].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided password is not a string', async () => {
      try {
        await newFly()
          .login({ username: 'some-username', password: 25 });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["password" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    // team override
  });

  describe('jobs', () => {
    it('throws an exception if no pipeline is provided', async () => {
      try {
        await newFly().jobs({});
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["pipeline" is required].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('throws an exception if the provided pipeline is not a string', async () => {
      try {
        await newFly().jobs({ pipeline: 25 });
      } catch(e) {
        expect(e instanceof Error).to.eql(true);
        expect(e.message)
          .to.eql('Invalid parameter(s): ["pipeline" must be a string].');
        return
      }
      expect.fail(null, null, 'Expected exception but none was thrown.');
    });

    it('gets all jobs in the supplied pipeline', async () => {
      const uri = 'https://concourse.example.com';

      const username = 'some-username';
      const password = 'some-password';

      const team = 'main';
      const pipeline = 'some-pipeline';

      const bearerToken = faker.random.alphaNumeric(800);
      const authToken = buildAuthToken({ value: bearerToken });

      const job = buildJob();

      mock.onGet(
        `${uri}/teams/${team}/auth/token`,
        {
          headers: {
            'Authorization': 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'
          }
        })
        .reply(200, authToken);

      mock.onGet(
        `${uri}/teams/${team}/pipelines/${pipeline}/jobs`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        })
        .reply(200, [job]);

      const fly = await new Fly({ uri, team })
        .login({ username, password });

      const jobs = await fly.jobs({ pipeline });

      expect(jobs).to.eql([job]);
    });
  })
});
